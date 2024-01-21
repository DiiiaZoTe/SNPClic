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
  stopFlowButtons,
  continueFlowButton,
}: StepCanStopFlowContent) => {
  const useMSF = useMultiStepFormContext();
  return (
    <AlertDialog open>
      <AlertDialogContent className="max-w-xl p-6 sm:p-8 w-full gap-6 sm:gap-8 overflow-auto max-h-[100dvh]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">{`Etape ${useMSF.stepper.currentStep}: ${title}`}</AlertDialogTitle>
        </AlertDialogHeader>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <div className="w-full flex flex-col gap-6 sm:gap-8">
          {stopFlowButtons?.map(({ label, warning, reason }) => (
            <div key={label} className="flex flex-row gap-4 w-full">
              <Button
                className="w-full group"
                onClick={() => {
                  useMSF.stepper.move.goToRecap(true, reason);
                }}
              >
                {label}
                <ChevronRight className="h-4 w-4 ml-2 transition-all group-hover:translate-x-1" />
              </Button>
              {warning && <WarningInfo info={warning} />}
            </div>
          ))}
          {continueFlowButton ? (
            <div className="flex flex-row gap-4 w-full">
              <Button
                className="w-full group"
                variant="black"
                onClick={() => {
                  useMSF.stepper.move.continueAfterStopFlow();
                }}
              >
                {continueFlowButton.label}
                <ChevronRight className="h-4 w-4 ml-2 transition-all group-hover:translate-x-1" />
              </Button>
              {continueFlowButton.warning && (
                <WarningInfo info={continueFlowButton.warning} />
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
    <Popover modal>
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
