"use client";

import { useRef } from "react";
import * as MSF from "../types";
import { cn } from "@/lib/utils";

import { ArrowBigLeftIcon, ChevronRight } from "lucide-react";
import { scrollToViewIfNeeded, stepFormVariants } from "../_utils/utils";

import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Form, FormDescription, FormLabel } from "@/components/ui/form";

import {
  MultiStepFormProvider,
  useMultiStepFormContext,
} from "../_hooks/multiStepFormContext";

import { FormTracker } from "./formTracker";
import {
  BodyQuestion,
  BooleanQuestion,
  MultiChoiceQuestion,
  MultiSelectQuestion,
  SelectQuestion,
} from "./questions";
import { RecapAnswers } from "./recapAnswers";

export const MultiStepForm = ({
  stepsData,
  className,
}: {
  stepsData: MSF.Form;
  className?: string;
}) => {
  const topFormRef = useRef<HTMLDivElement>(null);

  return (
    <div className={className} ref={topFormRef}>
      <MultiStepFormProvider stepsData={stepsData}>
        <MultiStepFormComponent containerRef={topFormRef} />
      </MultiStepFormProvider>
    </div>
  );
};

const MultiStepFormComponent = ({
  containerRef,
}: {
  containerRef?: React.RefObject<HTMLDivElement>;
}) => {
  const useMSF = useMultiStepFormContext();
  return (
    <>
      <TodoList />
      <div className="w-full max-w-xl flex justify-between items-center">
        <Button
          onClick={() => {
            scrollToViewIfNeeded(containerRef);
            useMSF.stepper.move.previous();
          }}
          variant="outline"
          className={cn(
            "h-[54px] w-[54px] flex justify-center items-center",
            useMSF.stepper.is.firstStep ? "invisible pointer-events-none" : ""
          )}
        >
          <ArrowBigLeftIcon className="w-5 h-5 fill-current" />
        </Button>
        <FormTracker className="rounded-lg" canOnlyGoBack={false} />
      </div>
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
                        (question, index) => {
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
                              {question.type === "boolean" && (
                                <BooleanQuestion question={question} />
                              )}
                              {question.type === "multiChoice" && (
                                <MultiChoiceQuestion question={question} />
                              )}
                              {question.type === "multiSelect" && (
                                <MultiSelectQuestion question={question} />
                              )}
                              {question.type === "select" && (
                                <SelectQuestion question={question} />
                              )}
                              {question.type === "body" && (
                                <BodyQuestion question={question} />
                              )}
                            </motion.div>
                          );
                        }
                      )}
                    </div>
                    <div className="flex flex-row justify-between gap-8">
                      {useMSF.stepper.is.lastStep ? (
                        <Button
                          type="submit"
                          variant="default"
                          className="w-fit ml-auto"
                        >
                          Terminer
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          variant="secondary"
                          className="w-fit ml-auto group"
                          onClick={() => {
                            scrollToViewIfNeeded(containerRef);
                          }}
                        >
                          Continuer
                          <ChevronRight className="h-4 w-4 ml-2 transition-all group-hover:translate-x-1" />
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </motion.div>
            </AnimatePresence>
          </div>
          {useMSF.submission.stopFlow.isStepStoppingFlow &&
          useMSF.submission.stopFlow.contentStepStoppingFlow ? (
            <StopFlowModal
              {...useMSF.submission.stopFlow.contentStepStoppingFlow}
            />
          ) : null}
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
import { StopFlowModal } from "./stopFlowModal";

const todo = [
  "verify everything is working as expected",
  "submission flow",
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
            <li key={index}>
              {item}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
