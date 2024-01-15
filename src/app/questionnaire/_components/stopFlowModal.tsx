import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Cancel as AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { StepCanStopFlowContent } from "../types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronRight, Info, X } from "lucide-react";
import { useMultiStepFormContext } from "../_hooks/multiStepFormContext";
import { Button } from "@/components/ui/button";

export const StopFlowModal = ({
  title,
  content,
  stopFlowButtonLabel,
  warningStopFlowButton,
  continueFlowButtonLabel,
  warningContinueFlowButton,
}: StepCanStopFlowContent) => {
  const useMSF = useMultiStepFormContext();
  return (
    <AlertDialog open>
      <AlertDialogContent className="max-w-3xl p-4 sm:p-6">
        <AlertDialogHeader>
          <AlertDialogTitle>{`Etape ${useMSF.stepper.currentStep}: ${title}`}</AlertDialogTitle>
        </AlertDialogHeader>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-between mt-4">
          {stopFlowButtonLabel ? (
            <div className="flex flex-row gap-4 w-full sm:w-fit sm:max-w-[50%]">
              <Button
                className="w-full sm:w-fit group"
                onClick={() => {
                  useMSF.stepper.move.goToRecap(true);
                }}
              >
                {stopFlowButtonLabel}
                <ChevronRight className="h-4 w-4 ml-2 transition-all group-hover:translate-x-1" />
              </Button>
              {warningStopFlowButton && (
                <WarningInfo info={warningStopFlowButton} />
              )}
            </div>
          ) : null}
          {continueFlowButtonLabel ? (
            <div className="flex flex-row gap-4 w-full sm:w-fit sm:max-w-[50%] ml-auto">
              <Button
                variant="black"
                className="w-full sm:w-fit group"
                onClick={() => {
                  useMSF.stepper.move.continueAfterStopFlow();
                }}
              >
                {continueFlowButtonLabel}
                <ChevronRight className="h-4 w-4 ml-2 transition-all group-hover:translate-x-1" />
              </Button>
              {warningContinueFlowButton && (
                <WarningInfo info={warningContinueFlowButton} />
              )}
            </div>
          ) : null}
        </div>

        <AlertDialogCancel
          className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => {
            useMSF.submission.stopFlow.cancelStepStoppingFlow();
          }}
        >
          <X className="h-6 w-6 p-1" />
          <span className="sr-only">Close</span>
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const WarningInfo = ({ info }: { info: string }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link" className="p-0">
          <Info className="w-4 h-4 stroke-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>{info}</p>
      </PopoverContent>
    </Popover>
  );
};
