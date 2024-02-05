"use client";

import { useRef } from "react";
import * as MSF from "../types";
import { cn } from "@/lib/utils";

import { ChevronRight } from "lucide-react";
import { stepFormVariants } from "../_utils/utils";

import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Form, FormDescription, FormLabel } from "@/components/ui/form";

import {
  MultiStepFormProvider,
  useMultiStepFormContext,
} from "../_hooks/multi-step-form-context";

import { FormTracker } from "./form-tracker";
import { QuestionSwitch } from "./questions";
import { StopFlowModal } from "./stop-flow-modal";
import { RecapAnswers } from "./recap-answers";

export const MultiStepForm = ({ stepsData }: { stepsData: MSF.Form }) => {
  const topFormRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="self-center w-full flex flex-col gap-8 items-center min-h-[calc(100dvh-6rem)]"
      ref={topFormRef}
    >
      <MultiStepFormProvider stepsData={stepsData} containerRef={topFormRef}>
        <MultiStepFormComponent />
      </MultiStepFormProvider>
    </div>
  );
};

const MultiStepFormComponent = () => {
  const useMSF = useMultiStepFormContext();
  return (
    <>
      <TodoList />
      <FormTracker canOnlyGoBack={false} />
      {!useMSF.submission.isFormSubmitted ? (
        <>
          <div className="flex flex-col items-center gap-8 w-screen px-4 sm:w-[calc(100svw-10px)] relative overflow-x-hidden grow overflow-y-hidden">
            <AnimatePresence
              initial={false}
              mode="popLayout"
              custom={useMSF.stepper.direction}
            >
              <motion.div
                className="w-full max-w-xl"
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
                    className="flex flex-col gap-8 w-full p-8 rounded-xl bg-background border border-muted"
                  >
                    <div>
                      <FormLabel className="font-bold text-xl">
                        {useMSF.stepper.currentStep}.{" "}
                        {useMSF.data.currentStep.name}
                      </FormLabel>
                      <FormDescription>
                        {useMSF.data.currentStep.description}
                      </FormDescription>
                    </div>
                    <div className="flex flex-col w-full gap-4">
                      {useMSF.data.currentStep.questions.map(
                        (question, _index) => {
                          const isHidden = useMSF.questions.isHidden(
                            question.key
                          );
                          if (isHidden) return null;
                          return (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              key={question.key}
                              className={cn(
                                "border border-muted bg-muted/5 rounded-sm p-4",
                                isHidden ? "hidden" : ""
                              )}
                            >
                              <QuestionSwitch question={question} />
                            </motion.div>
                          );
                        }
                      )}
                    </div>
                    {useMSF.data.currentStep.noContinueButton ? null : (
                      <div className="flex flex-row justify-between gap-8">
                        {useMSF.stepper.is.lastStep ? (
                          <Button
                            type="submit"
                            variant="default"
                            className="w-fit max-w-full ml-auto"
                          >
                            <span className="truncate min-w-0">
                              {useMSF.data.currentStep.continueLabel ??
                                "Terminer"}
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
                              {useMSF.data.currentStep.continueLabel ??
                                "Continuer"}
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
          <StopFlowModal />
        </>
      ) : (
        <RecapAnswers />
      )}
    </>
  );
};

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const todo = [
  "verify everything is working as expected",
  "submission flow",
  "recap to pdf",
  "backend database",
  "no need to create the form builder for now, maybe last",
];

const TodoList = () => {
  // popover
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
