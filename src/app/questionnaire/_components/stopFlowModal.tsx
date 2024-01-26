import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Cancel as AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import {
  CanStopFlowContent,
  CancelFlowButton,
  ContinueFlowButton,
  StopFlowButton,
} from "../types";
import { ChevronRight, X } from "lucide-react";
import { useMultiStepFormContext } from "../_hooks/multiStepFormContext";
import { Button } from "@/components/ui/button";

export const StopFlowModal = ({
  title,
  content,
  questionKey,
  stopFlowButtons,
  continueFlowButton,
  cancelFlowButton,
  continueToStep,
}: CanStopFlowContent) => {
  const useMSF = useMultiStepFormContext();
  return (
    <AlertDialog open>
      <AlertDialogContent className="max-w-xl p-6 sm:p-8 w-full gap-6 sm:gap-8 overflow-auto max-h-[100dvh]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">{`Etape ${useMSF.stepper.currentStep}: ${title}`}</AlertDialogTitle>
        </AlertDialogHeader>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <div className="w-full flex flex-col gap-6 sm:gap-8">
          {stopFlowButtons?.map((content) => (
            <ButtonWithWarning
              key={content.label}
              content={content}
              type="stop"
              onClick={() => {
                useMSF.controlFlow.stopped.goToRecap({
                  reason: content.reason,
                  questionKey,
                });
              }}
            />
          ))}
          {cancelFlowButton ? (
            <ButtonWithWarning
              key={cancelFlowButton.label}
              content={cancelFlowButton}
              type="cancel"
              onClick={() => useMSF.controlFlow.stopping.cancelStopFlow()}
            />
          ) : null}
          {continueFlowButton ? (
            <ButtonWithWarning
              key={continueFlowButton.label}
              content={continueFlowButton}
              type="continue"
              onClick={() =>
                useMSF.controlFlow.stopping.continueModalStopFlow(
                  continueToStep
                )
              }
            />
          ) : null}
        </div>

        <AlertDialogCancel
          className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => {
            useMSF.controlFlow.stopping.cancelStopFlow();
          }}
        >
          <X className="h-6 w-6 p-1" />
          <span className="sr-only">Close</span>
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
};
const ButtonWithWarning = ({
  content,
  type,
  onClick,
}: {
  content: ContinueFlowButton | StopFlowButton | CancelFlowButton;
  type: "continue" | "stop" | "cancel";
  onClick: () => void;
}) => (
  <div className="flex flex-col gap-2 w-full">
    {content.preText ? (
      <p className="text-sm text-muted-foreground">{content.preText}</p>
    ) : null}
    <div className="flex flex-row gap-4 w-full">
      <Button
        className="w-full group"
        variant={
          content.variant
            ? content.variant
            : type === "continue"
            ? "secondary"
            : type === "cancel"
            ? "black"
            : "default"
        }
        onClick={() => {
          onClick();
        }}
      >
        {content.label}
        <ChevronRight className="h-4 w-4 ml-2 transition-all group-hover:translate-x-1" />
      </Button>
      {/* {content.warning && <WarningInfo info={content.warning} />} */}
    </div>
    {content.postText ? (
      <p className="text-sm text-muted-foreground">{content.postText}</p>
    ) : null}
  </div>
);
