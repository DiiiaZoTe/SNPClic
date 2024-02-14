"use client";

import { useRef } from "react";
import * as MSF from "../types";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  MultiStepFormProvider,
  useMultiStepFormContext,
} from "../_hooks/multi-step-form-context";

import { api } from "@/trpc/react";

import { FormTracker } from "./form-tracker";
import { StopFlowModal } from "./stop-flow-modal";
import { Recap } from "./recap";

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

  const { mutate, isLoading, isSuccess, isError } =
    api.questionnaire.submitForm.useMutation({
      onSuccess: ({ submissionID }) => {
        toast.success(`Questionnaire envoyé avec succès. ID: ${submissionID}`);
      },
      onError: () => {
        errorToast(handleSubmit);
      },
    });

  const handleSubmit = () => {
    useMSF.other.scrollToView(false);
    mutate({
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

  //* form is loading
  if (isLoading) return <LoadingScreen />;

  // * form is not submitted (not in recap state)
  if (!useMSF.submission.isFormSubmitted)
    return (
      <div className="w-full flex flex-col gap-8 items-center animate-in-down">
        <TodoList />
        <FormTracker canOnlyGoBack={false} />
        <CurrentStepForm />
        <StopFlowModal />
      </div>
    );

  // * form is awaiting final submission
  if (!isSuccess)
    return (
      <div className="w-full flex flex-col gap-8 items-center grow overflow-y-auto max-w-xl animate-in-down">
        <FormTracker canOnlyGoBack={false} />
        <Recap />
        <FinalizeQuestionnaire
          handleSubmit={handleSubmit}
          isError={isError}
          isSuccess={isSuccess}
          isLoading={isLoading}
        />
      </div>
    );

  // * form is fully submitted
  return (
    <div className="w-full flex flex-col gap-8 items-center grow overflow-y-auto max-w-xl animate-in-down">
      <Recap />
    </div>
  );
};

const LoadingScreen = () => (
  <div className="flex-grow flex flex-col gap-8 justify-center items-center animate-in-down">
    <Logo className="w-20 h-20" />
    <div className="flex flex-col gap-2 justify-center items-center">
      <p className="text-center text-lg font-semibold">
        Envoie du questionnaire...
      </p>
      <p className="max-w-sm text-center">
        <Balancer>
          Merci de patienter un instant, nous sommes en train de finaliser
          l&apos;envoie de vos réponses.
        </Balancer>
      </p>
    </div>
    <Loading />
  </div>
);

const FinalizeQuestionnaire = ({
  handleSubmit,
  isLoading,
  isSuccess,
  isError,
}: {
  handleSubmit: () => void;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
}) => (
  <div className="flex flex-col gap-4 w-full">
    <p className="text-xl font-bold leading-none tracking-tight">
      Finaliser le questionnaire
    </p>
    <p className="text-sm text-muted-foreground">
      Envoyer vos réponses pour terminer le questionnaire. Une fois terminé,
      vous ne pourrez plus modifier vos réponses. L&apos;envoie peut prendre
      quelques instants.
    </p>
    {isError && (
      <p className="text-destructive text-sm font-medium">
        Une erreur est survenue lors de l&apos;envoie. Veuillez réessayer dans
        quelques secondes.
        <br /> Si le problème persiste, veuillez nous contacter par email.
      </p>
    )}
    <Button
      onClick={handleSubmit}
      className="w-fit max-w-full ml-auto group"
      disabled={isSuccess || isLoading}
    >
      <span className="truncate min-w-0">Valider et terminer</span>
      <ChevronRight className="h-4 w-4 ml-2 transition-all group-hover:translate-x-1" />
    </Button>
  </div>
);

const errorToast = (submitForm: () => void) => {
  toast(
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold">
          Erreur lors de l&apos;envoie du questionnaire
        </p>
        <p className="text-sm ">
          Veuillez réessayer. Si le problème persiste, veuillez nous contacter
          par email.
        </p>
      </div>
      <Button onClick={submitForm} variant="destructive" className="w-full">
        Réesayer
      </Button>
    </div>
  );
};

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Loading } from "../../../components/utilities/loading";
import { CurrentStepForm } from "./current-step-form";
import { Logo } from "@/components/logos/logo";
import Balancer from "react-wrap-balancer";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { is } from "drizzle-orm";

const todo = [
  "submission flow",
  "recap to pdf",
  "backend database",
  "no need to create the form builder for now, maybe last",
];

const TodoList = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">To do?</Button>
      </PopoverTrigger>
      <PopoverContent>
        <ul className="flex flex-col gap-2 pl-4 list-disc">
          {todo.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
