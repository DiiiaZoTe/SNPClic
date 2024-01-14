"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, XIcon } from "lucide-react";
import { useCallback } from "react";
import { useMultiStepFormContext } from "../_hooks/multiStepFormContext";

/** a component that tracks the steps of the form */
export const FormTracker = ({
  className,
  canOnlyGoBack = true,
}: {
  className?: string;
  canOnlyGoBack?: boolean;
}) => {
  const useMSF = useMultiStepFormContext();
  const currentStep = useMSF.stepper.currentStep;
  const goToStep = (step: number) => {
    useMSF.stepper.move.goTo(step);
  };

  const canClick = useCallback(
    (step: number, isVisited: boolean) => {
      if (step === currentStep) return false; // can't click on current step
      if (canOnlyGoBack) return step < currentStep; // can only go back
      // is the current step already visited?
      return isVisited;
    },
    [currentStep, canOnlyGoBack]
  );

  return (
    <div
      className={cn(
        "flex justify-center items-center gap-4 p-4 rounded-full bg-background border border-muted w-fit box-border",
        className
      )}
    >
      {Array.from(Array(useMSF.stepper.numberOfSteps).keys()).map((index) => {
        const thisStep = index + 1;
        return (
          <DotWithCircle
            key={thisStep}
            active={thisStep === currentStep}
            isVisited={useMSF.stepper.is.visited(thisStep)}
            isValid={useMSF.stepper.is.valid(thisStep)}
            stepNumber={thisStep}
            onClickFn={goToStep}
            canClick={
              canClick(thisStep, useMSF.stepper.is.visited(thisStep)) ||
              useMSF.submission.isFormSubmitted
            }
          />
        );
      })}
    </div>
  );
};

const DotWithCircle = ({
  stepNumber,
  active = false,
  isVisited = false,
  isValid = false,
  canClick,
  onClickFn,
}: {
  stepNumber: number;
  active: boolean;
  isVisited: boolean;
  isValid: boolean;
  canClick: boolean;
  onClickFn?: (step: number) => void;
}) => {
  const isFormSubmitted = useMultiStepFormContext().submission.isFormSubmitted;
  return (
    <div className="relative">
      <Button
        className={cn(
          "w-5 h-5 rounded-full block transition-all p-0 m-0 hover:bg-foreground focus ",
          isFormSubmitted
            ? "bg-primary"
            : active
            ? "bg-primary/30"
            : !isVisited
            ? "bg-accent"
            : !isValid
            ? "bg-destructive/30"
            : isVisited && isValid
            ? "bg-primary"
            : "bg-accent",
          canClick ? "cursor-pointer" : "cursor-default pointer-events-none"
        )}
        onClick={(e) => {
          e.currentTarget.blur();
          onClickFn ? onClickFn(stepNumber) : null;
        }}
        disabled={!canClick}
      />
      <AnimatePresence>
        {!active && isVisited && !isValid && (
          <XIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 stroke-[4px] text-background pointer-events-none" />
        )}
        {(!active && isVisited && isValid) || isFormSubmitted ? (
          <CheckIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 stroke-[4px] text-background pointer-events-none" />
        ) : null}
        {active && !isFormSubmitted && (
          <motion.span
            className="absolute top-0 left-0 block w-5 h-5 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              rotate: 360,
              transition: {
                duration: 1,
                rotate: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: [0.79, 0.19, 0.27, 0.87],
                },
                ease: "linear",
              },
            }}
          >
            <span className="absolute w-[6px] h-[6px] top-0 left-1/2 -translate-x-1/2 rounded-full bg-primary" />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

const MotionCheckIcon = motion(CheckIcon);
