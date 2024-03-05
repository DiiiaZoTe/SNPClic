"use client";

import { useRef, useState } from "react";
import * as MSF from "../types";

import { LoadingScreen } from "./loading-screen";
import { ChevronRight, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Balancer from "react-wrap-balancer";
import { api } from "@/trpc/react";

import {
  MultiStepFormProvider,
  useMultiStepFormContext,
} from "../_hooks/multi-step-form-context";

import { FormTracker } from "./form-tracker";
import { StopFlowModal } from "./stop-flow-modal";
import { CurrentStepForm } from "./current-step-form";
import { Recap } from "./recap";
import { errorToast } from "@/components/utilities/toasts";
import { DotAnimation, ExtraSection } from "./other";
import { DownloadButton } from "@/components/utilities/downloadButton";
import { Button } from "@/components/ui/button";

export const MultiStepForm = ({ form }: { form: MSF.Form }) => {
  const topFormRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="self-center w-full flex flex-col gap-8 items-center"
      ref={topFormRef}
    >
      <MultiStepFormProvider form={form} containerRef={topFormRef}>
        <MultiStepFormComponent />
      </MultiStepFormProvider>
    </div>
  );
};

const MultiStepFormComponent = () => {
  const useMSF = useMultiStepFormContext();

  const [submissionID, setSubmissionID] = useState<string | undefined>();
  const [successInsert, setSuccessInsert] = useState<boolean>(false);
  const [successPDF, setSuccessPDF] = useState<boolean>(false);

  const submitForm = api.questionnaire.submitFormAndPDF.useMutation({
    onSuccess: ({ submissionID: subID, successInsert, successPDF }) => {
      useMSF.other.scrollToView(false);
      setSubmissionID(subID);
      if (successInsert && successPDF) {
        toast.success(`Questionnaire sauvegardé et PDF généré avec succès.`);
        setSuccessInsert(true);
        setSuccessPDF(true);
        return;
      }
      if (!successInsert)
        return errorToast({
          title: "Erreur lors de la sauvegarde du questionnaire",
          description:
            "Une erreur est survenue lors de la sauvegarde du questionnaire. Veuillez réessayer dans quelques secondes. Si le problème persiste, veuillez nous contacter.",
          actionButton: {
            action: handleSubmit,
            buttonLabel: "Réessayer",
            buttonVariant: "black",
          },
        });
      setSuccessInsert(true);
      if (!successPDF)
        return errorToast({
          title: "Erreur lors de la génération du PDF",
          description:
            "Vos données ont été sauvegardées avec succès, mais la génération du PDF a échoué. Veuillez réessayer dans quelques secondes. Si le problème persiste, veuillez nous contacter.",
          actionButton: {
            action: () => handleGeneratePDF(subID),
            buttonLabel: "Réessayer",
            buttonVariant: "black",
          },
        });
      setSuccessPDF(true);
    },
    onError: () => {
      errorToast({
        title: "Erreur lors de la sauvegarde du questionnaire",
        description:
          "Veuillez réessayer dans quelques secondes. Si le problème persiste, veuillez nous contacter.",
        actionButton: {
          action: handleSubmit,
          buttonLabel: "Réessayer",
          buttonVariant: "black",
        },
      });
      useMSF.other.scrollToView(false);
    },
  });

  const handleSubmit = () => {
    toast.dismiss();

    submitForm.mutate({
      formID: useMSF.id,
      stopReason: useMSF.controlFlow.stopped.formStoppedReason,
      skippedSteps: useMSF.stepper.listSkippedSteps(),
      answers: useMSF.data.flattenForm.map((question) => {
        const answer = useMSF.answers.question(question.id);
        const skipped =
          useMSF.questions.isSkipped(question.id) ||
          useMSF.questions.isHidden(question.id);
        return {
          questionID: question.id,
          answerType: question.answerType,
          answer:
            skipped || answer === undefined
              ? useMSF.data.defaultValues[question.id]
              : answer,
          skipped: skipped,
        };
      }),
      // fake: true,
      // error: true,
    });
  };

  const pdfGeneration = api.questionnaire.generatePDF.useMutation({
    onSuccess: ({ filename }) => {
      useMSF.other.scrollToView(false);
      setSuccessPDF(true);
      toast.success(
        `Le PDF a été généré avec succès. Nom du fichier: ${filename}.pdf`
      );
    },
    onError: () => {
      setSuccessPDF(false);
      errorToast({
        title: "Erreur lors de la génération du PDF",
        description:
          "Veuillez réessayer dans quelques secondes. Si le problème persiste, veuillez nous contacter.",
        actionButton: {
          action: () => handleGeneratePDF(submissionID),
          buttonLabel: "Réessayer",
          buttonVariant: "black",
        },
      });
      useMSF.other.scrollToView(false);
    },
  });

  const handleGeneratePDF = (subID?: string) => {
    toast.dismiss();
    if (!subID) return;
    pdfGeneration.mutate(subID);
  };

  const isLoading = submitForm.isLoading || pdfGeneration.isLoading;

  //* form is loading
  if (isLoading)
    return (
      <LoadingScreen
        isLoading={isLoading}
        title={
          <Balancer>
            {submitForm.isLoading
              ? "Envoie du questionnaire et génération du PDF"
              : pdfGeneration.isLoading
              ? "Génération du PDF"
              : "Traitement en cours"}
            <DotAnimation />
          </Balancer>
        }
        description={
          <Balancer>
            Merci de patienter un instant, nous sommes en train de tout
            finaliser. Cela peut prendre quelques secondes.
          </Balancer>
        }
      />
    );

  // * form is not submitted (not in recap state)
  if (!useMSF.submission.isFormSubmitted)
    return (
      <div className="w-full flex flex-col gap-8 items-center animate-in-down">
        <FormTracker canOnlyGoBack={false} />
        <CurrentStepForm />
        <StopFlowModal />
      </div>
    );

  // * form is awaiting final submission
  if (!successInsert || !successPDF) {
    return (
      <div className="w-full flex flex-col gap-8 items-center grow overflow-y-auto max-w-xl animate-in-down">
        {!successInsert && <FormTracker canOnlyGoBack={false} />}
        <Recap />
        {!successInsert ? (
          <ExtraSection
            handleSubmit={handleSubmit}
            isError={submitForm.isError}
            isLoading={submitForm.isLoading}
            isSuccess={submitForm.isSuccess}
            title="Finaliser le questionnaire"
            description="Envoyer vos réponses pour terminer le questionnaire. Une fois terminé, vous ne pourrez plus modifier vos réponses. L'envoie peut prendre quelques instants."
            error="Une erreur est survenue lors de l'envoie du questionnaire. Veuillez réessayer dans quelques secondes. Si le problème persiste, veuillez nous contacter."
            buttonLabel="Envoyer et terminer"
          />
        ) : (
          // generate PDF Section
          <ExtraSection
            handleSubmit={() => handleGeneratePDF(submissionID)}
            isError={pdfGeneration.isError}
            isLoading={pdfGeneration.isLoading}
            isSuccess={pdfGeneration.isSuccess}
            title="Générer le PDF"
            description="Générer le PDF pour finaliser le questionnaire. Une fois généré, vous pourrez le télécharger."
            error="Une erreur est survenue lors de la génération du PDF. Veuillez réessayer dans quelques secondes. Si le problème persiste, veuillez nous contacter."
            buttonLabel="Générer le PDF"
          />
        )}
      </div>
    );
  }

  // * form is fully submitted
  return (
    <div className="w-full flex flex-col gap-8 items-center grow overflow-y-auto max-w-xl animate-in-down">
      <ExtraSection
        title="Télécharger le PDF"
        description="Vous pouvez télécharger le PDF de votre questionnaire pour le conserver ou le partager."
      >
        <DownloadButton
          className="w-full xs:w-40 max-w-full ml-auto group"
          filename={submissionID}
          loader={<Loader2 className="animate-spin h-4 w-4" />}
        >
          Télécharger
          <Download className="h-4 w-4 ml-2" />
        </DownloadButton>
      </ExtraSection>
      <ExtraSection
        title="Nouvelle soumission"
        description="Voulez-vous soummettre une nouvelle réponse à ce questionnaire ?"
      >
        <Button
          variant="black"
          className="w-full xs:w-40 max-w-full ml-auto group"
          onClick={() => window.location.reload()}
        >
          Continuer
          <ChevronRight className="h-4 w-4 ml-2 transition-all group-hover:translate-x-1" />
        </Button>
      </ExtraSection>
    </div>
  );
};
