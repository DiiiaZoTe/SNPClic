"use client";

import { cn } from "@/lib/utils";

import { ChevronRight } from "lucide-react";
import { stepFormVariants } from "../_utils/utils";

import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Form, FormDescription, FormLabel } from "@/components/ui/form";

import { useMultiStepFormContext } from "../_hooks/multi-step-form-context";
import { QuestionSwitch } from "./questions";

export const CurrentStepForm = () => {
  const useMSF = useMultiStepFormContext();
  return (
    <div className="flex flex-col items-center gap-8 w-full relative overflow-x-hidden grow overflow-y-hidden">
      <AnimatePresence
        initial={false}
        mode="popLayout"
        custom={useMSF.stepper.direction}
      >
        <motion.div
          className="w-full max-w-3xl"
          key={`currentStep_${useMSF.stepper.currentStep}`}
          custom={useMSF.stepper.direction}
          variants={stepFormVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <Form {...useMSF.form}>
            <form
              onSubmit={useMSF.form.handleSubmit(
                useMSF.submission.onSubmitCallback
              )}
              className="flex flex-col gap-8 w-full xs:p-8 rounded-xl bg-background xs:border border-muted"
            >
              <div>
                <FormLabel className="font-bold text-xl">
                  {`${useMSF.stepper.currentStep}. ${useMSF.data.currentStep.name}`}
                </FormLabel>
                <FormDescription>
                  {useMSF.data.currentStep.description}
                </FormDescription>
              </div>
              <div className="flex flex-col w-full gap-4">
                {useMSF.data.currentStep.questions.map((question, _index) => {
                  const isHidden = useMSF.questions.isHidden(question.id);
                  if (isHidden) return null;
                  return (
                    <div
                      key={question.id}
                      className={cn(
                        "border border-muted bg-muted/5 rounded-sm p-4 animate-fade-in",
                        isHidden ? "hidden" : ""
                      )}
                    >
                      <QuestionSwitch question={question} />
                    </div>
                  );
                })}
              </div>
              {useMSF.data.currentStep.noContinueButton ? null : (
                <div className="flex flex-row justify-between gap-8">
                  {useMSF.stepper.is.lastStep ? (
                    <Button
                      type="submit"
                      variant="default"
                      className="w-fit max-w-full ml-auto group"
                    >
                      <span className="truncate min-w-0">
                        {useMSF.data.currentStep.continueLabel ?? "Terminer"}
                      </span>
                      <ChevronRight className="h-4 w-4 ml-2 transition-all group-hover:translate-x-1" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="secondary"
                      className="w-fit max-w-full ml-auto group"
                    >
                      <span className="truncate min-w-0">
                        {useMSF.data.currentStep.continueLabel ?? "Continuer"}
                      </span>
                      <ChevronRight className="h-4 w-4 ml-2 transition-all group-hover:translate-x-1" />
                    </Button>
                  )}
                </div>
              )}
            </form>
          </Form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
