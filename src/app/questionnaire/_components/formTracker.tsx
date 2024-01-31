"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowBigLeftIcon,
  CheckIcon,
  ChevronsRight,
  XIcon,
} from "lucide-react";
import { useCallback } from "react";
import { useMultiStepFormContext } from "../_hooks/multiStepFormContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { useTheme } from "next-themes";

/** a component that tracks the steps of the form */
export const FormTracker = ({
  canOnlyGoBack = true,
}: {
  canOnlyGoBack?: boolean;
}) => {
  const useMSF = useMultiStepFormContext();
  const currentStep = useMSF.stepper.currentStep;
  const numberOfSteps = useMSF.stepper.numberOfSteps;

  const canClick = useCallback(
    (step: number, isVisited: boolean) => {
      if (step === currentStep) return false;
      if (canOnlyGoBack) return step < currentStep; // can only go back
      // is the current step already visited?
      return isVisited;
    },
    [currentStep, canOnlyGoBack]
  );

  return (
    <div className="w-full max-w-xl flex justify-between items-center gap-8">
      <Button
        onClick={() => {
          useMSF.stepper.goTo.previous();
        }}
        variant="outline"
        className={cn(
          "h-[54px] w-[54px] flex justify-center items-center",
          useMSF.stepper.is.firstStep ? "invisible pointer-events-none" : ""
        )}
      >
        <ArrowBigLeftIcon className="w-5 h-5 fill-current" />
      </Button>
      {numberOfSteps > 4 ? (
        <SelectStep canClick={canClick} />
      ) : (
        <DotSteps canClick={canClick} />
      )}
    </div>
  );
};

const DotSteps = ({
  canClick,
}: {
  canClick: (step: number, isVisited: boolean) => boolean;
}) => {
  return (
    <div className="flex justify-center items-center gap-4 p-4 rounded-md bg-background border border-muted w-fit box-border">
      <StepsLoopWrapper
        canClick={canClick}
        render={({
          step,
          active,
          isVisited,
          isSkipped,
          isValid,
          canClickStep,
        }) => (
          <Dot
            key={step}
            active={active}
            isVisited={isVisited}
            isSkipped={isSkipped}
            isValid={isValid}
            stepNumber={step}
            canClick={canClickStep}
          />
        )}
      />
    </div>
  );
};

const SelectStep = ({
  canClick,
}: {
  canClick: (step: number, isVisited: boolean) => boolean;
}) => {
  const useMSF = useMultiStepFormContext();
  const currentStep = useMSF.stepper.currentStep;
  const isFormSubmitted = useMSF.submission.isFormSubmitted;
  const { theme } = useTheme();

  return (
    <Select
      value={currentStep.toString() || "1"}
      onValueChange={(v) => {
        const toStep = parseInt(v);
        if (toStep === currentStep) return;
        useMSF.stepper.goTo.step(toStep);
      }}
    >
      {/* <SelectTrigger className="w-full h-[54px] rounded-md min-w-0 gap-2">
        <div className="min-w-0">
          <span className="truncate block">{`${currentStep}. ${
            useMSF.data.step(currentStep).name
          }`}</span>
        </div>
      </SelectTrigger> */}

      <SelectTrigger className="w-fit h-[54px] rounded-md min-w-0 gap-2">
        <div className="flex flex-row w-full h-full items-center gap-2">
          <CircularProgressbar
            value={
              isFormSubmitted
                ? useMSF.stepper.numberOfSteps - 1
                : currentStep - 1
            }
            maxValue={useMSF.stepper.numberOfSteps - 1}
            className="w-8 h-8"
            strokeWidth={20}
            styles={{
              path: {
                stroke: theme === "dark" ? "#1c9c4b" : "#10a847",
              },
              trail: {
                stroke: theme === "dark" ? "#262626" : "#f2f2f2",
              },
            }}
          />
          <span className="w-full">
            {isFormSubmitted
              ? "Récapitulatif"
              : `${currentStep} / ${useMSF.stepper.numberOfSteps}`}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent className="max-w-[calc(100vw-1.5rem)]">
        <StepsLoopWrapper
          canClick={canClick}
          render={({
            step,
            active,
            isVisited,
            isSkipped,
            isValid,
            canClickStep,
          }) => (
            <SelectItem
              key={step}
              value={`${step}`}
              withCheck={false}
              className={cn(
                "h-10 w-full",
                step === currentStep
                  ? "bg-primary/10 focus:bg-primary/10 cursor-default"
                  : ""
              )}
              disabled={!canClickStep && step !== currentStep}
            >
              <div className="flex flex-row gap-4 min-w-0 max-w-[calc(100vw-5rem)]">
                <Dot
                  active={active}
                  isVisited={isVisited}
                  isSkipped={isSkipped}
                  isValid={isValid}
                  stepNumber={step}
                  button={false}
                />
                <span className="truncate">
                  {`${step}. ${useMSF.data.step(step).name}`}
                </span>
              </div>
            </SelectItem>
          )}
        />
      </SelectContent>
    </Select>
  );
};

const Dot = ({
  stepNumber,
  active = false,
  isVisited = false,
  isSkipped = false,
  isValid = false,
  canClick = false,
  button = true,
}: {
  stepNumber: number;
  active?: boolean;
  isVisited?: boolean;
  isSkipped?: boolean;
  isValid?: boolean;
  canClick?: boolean;
  button?: boolean;
}) => {
  const useMSF = useMultiStepFormContext();
  const isFormSubmitted = useMSF.submission.isFormSubmitted;
  const className = cn(
    "w-5 h-5 rounded-full block transition-all p-0 m-0 hover:bg-foreground focus ",
    isFormSubmitted && isVisited && isValid
      ? "bg-primary"
      : active
      ? "bg-primary/30"
      : isSkipped
      ? "bg-yellow-500"
      : !isVisited
      ? "bg-accent"
      : !isValid
      ? "bg-destructive/80"
      : isVisited && isValid
      ? "bg-primary"
      : "bg-accent",
    canClick ? "cursor-pointer" : "cursor-default pointer-events-none"
  );

  return (
    <div className="relative w-fit">
      {button ? (
        <Button
          className={className}
          onClick={(e) => {
            e.currentTarget.blur();
            useMSF.stepper.goTo.step(stepNumber);
          }}
          disabled={!canClick}
        >
          <span className="sr-only">
            {`${stepNumber}. ${useMSF.data.step(stepNumber).name}`}
          </span>
        </Button>
      ) : (
        <div className={className}>
          <span className="sr-only">
            {`${stepNumber}. ${useMSF.data.step(stepNumber).name}`}
          </span>
        </div>
      )}
      {!active && isVisited && !isValid && (
        <XIcon
          key="invalid"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 stroke-[4px] text-background pointer-events-none"
        />
      )}
      {(!active && isVisited && isValid) ||
      (isFormSubmitted && isVisited && isValid) ? (
        <CheckIcon
          key="valid"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 stroke-[4px] text-background pointer-events-none"
        />
      ) : null}
      {isSkipped && (
        <ChevronsRight
          key="skipped"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 stroke-[3px] text-background pointer-events-none"
        />
      )}
      {active && !isFormSubmitted && (
        <span
          key="base active"
          className="absolute w-2 h-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        />
      )}
    </div>
  );
};

const StepsLoopWrapper = ({
  canClick,
  render,
}: {
  canClick: (step: number, isVisited: boolean) => boolean;
  render: (info: {
    step: number;
    active?: boolean;
    isVisited?: boolean;
    isSkipped?: boolean;
    isValid?: boolean;
    canClickStep?: boolean;
  }) => React.ReactNode;
}) => {
  const useMSF = useMultiStepFormContext();
  const currentStep = useMSF.stepper.currentStep;

  return (
    <>
      {Array.from(Array(useMSF.stepper.numberOfSteps).keys()).map((index) => {
        const thisStep = index + 1;
        const active = thisStep === currentStep;
        const isVisited = useMSF.stepper.is.visited(thisStep);
        const isSkipped = useMSF.stepper.is.skipped(thisStep);
        const isValid = useMSF.stepper.is.valid(thisStep);
        const canClickThisStep =
          canClick(thisStep, isVisited) ||
          (useMSF.submission.isFormSubmitted && isVisited);

        return render({
          step: thisStep,
          active,
          isVisited,
          isSkipped,
          isValid,
          canClickStep: canClickThisStep,
        });
      })}
    </>
  );
};
