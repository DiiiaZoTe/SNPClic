import { useEffect, useState } from "react";
import {
  CanStopFlowContent,
  CancelFlowButton,
  ContinueFlowButton,
  StopFlowButton,
} from "../types";
import { ChevronRight } from "lucide-react";
import { useMultiStepFormContext } from "../_hooks/multiStepFormContext";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const StopFlowModal = () => {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const useMSF = useMultiStepFormContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [content, setContent] = useState<CanStopFlowContent | undefined>(
    undefined
  );
  const isStopFlowActive =
    useMSF.controlFlow.stopping.content !== undefined &&
    useMSF.controlFlow.stopping.isStopping;

  useEffect(() => {
    if (isStopFlowActive && !isOpen) {
      setIsOpen(true);
      setContent(useMSF.controlFlow.stopping.content);
      return;
    }
    if (!isStopFlowActive && isOpen && !isClosing) {
      setIsClosing(true);
      setIsOpen(false);
      // delay to let the exit animation play
      setTimeout(() => {
        setIsClosing(false);
        setContent(undefined);
      }, 300); // Match exit animation time
    }
  }, [
    content,
    isOpen,
    isClosing,
    useMSF.controlFlow.stopping.content,
    isStopFlowActive,
  ]);

  return (
    <>
      <StopFlowDialog content={content} open={isOpen && isDesktop} />
      <StopFlowSheet content={content} open={isOpen && !isDesktop} />
    </>
  );
};

const StopFlowDialog = ({
  content,
  open,
}: {
  content?: CanStopFlowContent;
  open: boolean;
}) => {
  const useMSF = useMultiStepFormContext();
  if (!content) return null;

  const {
    title,
    content: mainContent,
    questionKey,
    stopFlowButtons,
    continueFlowButton,
    cancelFlowButton,
    continueToStep,
  } = content;

  return (
    <Dialog
      open={open}
      onOpenChange={() => useMSF.controlFlow.stopping.cancelStopFlow()}
    >
      <DialogContent className="max-w-xl p-6 sm:p-8 w-full gap-6 sm:gap-8 overflow-auto max-h-[100dvh]">
        <DialogHeader>
          <DialogTitle className="text-left">{`Etape ${useMSF.stepper.currentStep}: ${title}`}</DialogTitle>
        </DialogHeader>
        <div dangerouslySetInnerHTML={{ __html: mainContent }} />
        <div className="w-full flex flex-col gap-6 sm:gap-8">
          {stopFlowButtons?.map((content) => (
            <ButtonWithTexts
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
          {continueFlowButton ? (
            <ButtonWithTexts
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
          {cancelFlowButton ? (
            <ButtonWithTexts
              key={cancelFlowButton.label}
              content={cancelFlowButton}
              type="cancel"
              onClick={() => useMSF.controlFlow.stopping.cancelStopFlow()}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StopFlowSheet = ({
  content,
  open,
}: {
  content?: CanStopFlowContent;
  open: boolean;
}) => {
  const useMSF = useMultiStepFormContext();
  if (!content) return null;

  const {
    title,
    content: mainContent,
    questionKey,
    stopFlowButtons,
    continueFlowButton,
    cancelFlowButton,
    continueToStep,
  } = content;

  return (
    <Sheet
      open={open}
      onOpenChange={() => useMSF.controlFlow.stopping.cancelStopFlow("Sheet")}
    >
      <SheetContent
        className="flex flex-col gap-6 p-6 sm:p-8 w-full  pt-12"
        side="bottom"
      >
        <SheetHeader className="text-left">
          <SheetTitle>{`Etape ${useMSF.stepper.currentStep}: ${title}`}</SheetTitle>
          <div dangerouslySetInnerHTML={{ __html: mainContent }} />
        </SheetHeader>
        <div className="w-full flex flex-col gap-6 sm:gap-8">
          {stopFlowButtons?.map((content) => (
            <ButtonWithTexts
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
          {continueFlowButton ? (
            <ButtonWithTexts
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
          {cancelFlowButton ? (
            <ButtonWithTexts
              key={cancelFlowButton.label}
              content={cancelFlowButton}
              type="cancel"
              onClick={() => useMSF.controlFlow.stopping.cancelStopFlow()}
            />
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
};

/** continue, stop and cancel buttons with pre/post texts */
const ButtonWithTexts = ({
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
    </div>
    {content.postText ? (
      <p className="text-sm text-muted-foreground">{content.postText}</p>
    ) : null}
  </div>
);