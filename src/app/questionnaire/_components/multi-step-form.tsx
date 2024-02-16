"use client";

import { ReactNode, useRef, useState } from "react";
import * as MSF from "../types";

import { Button } from "@/components/ui/button";
import { LoadingScreen } from "./loading-screen";
import { ChevronRight, Download } from "lucide-react";
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
import { DotAnimation } from "./other";
import { DownloadButton } from "@/components/utilities/downloadButton";

export const MultiStepForm = ({ form }: { form: MSF.Form }) => {
  const topFormRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="self-center w-full flex flex-col gap-8 items-center min-h-[calc(100dvh-6rem)]"
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
          action: handleSubmit,
          title: "Erreur lors de la sauvegarde du questionnaire",
          description:
            "Une erreur est survenue lors de la sauvegarde du questionnaire. Veuillez réessayer dans quelques secondes. Si le problème persiste, veuillez nous contacter.",
          buttonLabel: "Réessayer",
          buttonVariant: "black",
        });
      setSuccessInsert(true);
      if (!successPDF)
        return errorToast({
          action: () => handleGeneratePDF(subID),
          title: "Erreur lors de la génération du PDF",
          description:
            "Vos données ont été sauvegardées avec succès, mais la génération du PDF a échoué. Veuillez réessayer dans quelques secondes. Si le problème persiste, veuillez nous contacter.",
          buttonLabel: "Réessayer",
          buttonVariant: "black",
        });
      setSuccessPDF(true);
    },
    onError: () => {
      errorToast({
        action: handleSubmit,
        title: "Erreur lors de la sauvegarde du questionnaire",
        description:
          "Veuillez réessayer dans quelques secondes. Si le problème persiste, veuillez nous contacter.",
        buttonLabel: "Réessayer",
        buttonVariant: "black",
      });
      useMSF.other.scrollToView(false);
    },
  });

  const handleSubmit = () => {
    toast.dismiss();

    submitForm.mutate({
      formID: useMSF.id,
      stopReason: useMSF.controlFlow.stopped.formStoppedReason,
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
        action: () => handleGeneratePDF(submissionID),
        title: "Erreur lors de la génération du PDF",
        description:
          "Veuillez réessayer dans quelques secondes. Si le problème persiste, veuillez nous contacter.",
        buttonLabel: "Réessayer",
        buttonVariant: "black",
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
          <>
            {submitForm.isLoading
              ? "Envoie du questionnaire et génération du PDF"
              : pdfGeneration.isLoading
              ? "Génération du PDF"
              : ""}
            <DotAnimation />
          </>
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
          <BottomSection
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
          <BottomSection
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
      <Recap />
      <BottomSection
        handleSubmit={() => handleGeneratePDF(submissionID)}
        title="Télécharger le PDF"
        description="Vous pouvez télécharger le PDF de votre questionnaire pour le conserver ou le partager."
      >
        <DownloadButton
          className="w-fit max-w-full ml-auto group"
          filename={submissionID}
        >
          Télécharger
          <Download className="h-4 w-4 ml-2" />
        </DownloadButton>
      </BottomSection>
    </div>
  );
};

const BottomSection = ({
  handleSubmit,
  isLoading,
  isSuccess,
  isError,
  title,
  description,
  error,
  buttonLabel,
  children,
}: {
  handleSubmit: () => void;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  title: string;
  description: string;
  error?: string;
  buttonLabel?: string;
  children?: ReactNode;
}) => (
  <div className="flex flex-col gap-4 w-full">
    <p className="text-xl font-bold leading-none tracking-tight">{title}</p>
    <p className="text-sm text-muted-foreground">{description}</p>
    {isError && (
      <p className="text-destructive text-sm font-medium">
        {error ||
          "Une erreur est survenue. Veuillez réessayer dans quelques secondes."}
      </p>
    )}
    {children ?? (
      <Button
        onClick={handleSubmit}
        className="w-fit max-w-full ml-auto group"
        disabled={isSuccess || isLoading}
      >
        <span className="truncate min-w-0">{buttonLabel ?? "Continuer"}</span>
        <ChevronRight className="h-4 w-4 ml-2 transition-all group-hover:translate-x-1" />
      </Button>
    )}
  </div>
);
