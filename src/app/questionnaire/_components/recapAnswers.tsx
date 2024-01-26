"use client";

import { ReactNode } from "react";
import { Check, ChevronsRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  QuestionType,
  Question,
  StringAnswer,
  MultiStringAnswer,
  BooleanAnswer,
  Answer,
} from "../types";
import { useMultiStepFormContext } from "../_hooks/multiStepFormContext";
import { Badge } from "@/components/ui/badge";

import { motion } from "framer-motion";

const NO_ANSWER = "Aucune réponse";

export const RecapAnswers = () => {
  const useMSF = useMultiStepFormContext();

  const indexOfStopQuestion = useMSF.data.flattenForm.findIndex(
    (question) =>
      useMSF.controlFlow.stopped.formStoppedReason?.questionKey &&
      question.key === useMSF.controlFlow.stopped.formStoppedReason.questionKey
  );

  return (
    <div className="p-0 flex flex-col gap-8 w-full h-full max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="shrink-0 flex flex-col gap-4"
      >
        <p className="text-xl font-bold leading-none tracking-tight">
          Récapitulatif
        </p>
        <p className="text-sm text-muted-foreground">
          Vérifier la validité de vos réponses.
        </p>
      </motion.div>
      <div className="grow overflow-y-auto flex flex-col gap-8">
        {useMSF.data.form.map((stepData, i) => {
          // only show the steps before or equal to the current step
          // if (useMSF.stepper.is.skipped(i + 1)) return null;
          return (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1 * (i + 1), duration: 0.2 }}
              key={i}
              className="flex flex-col gap-2"
            >
              <div className="flex flex-col justify-center items-between gap-4 xs:flex-row xs:justify-between xs:items-center font-semibold text-foreground">
                <span>
                  {i + 1}. {useMSF.data.form[i].name}
                </span>
                {useMSF.stepper.is.skipped(i + 1) ? (
                  <div className="w-fit rounded-sm flex justify-center items-center gap-1 text-xs bg-secondary/40 px-2 py-1">
                    Etape sautée
                    <ChevronsRight className="w-4 h-4 stroke-2" />
                  </div>
                ) : null}
              </div>
              {!useMSF.stepper.is.skipped(i + 1) ? (
                <div className="flex flex-col gap-2">
                  {
                    // get the question and the answer in text format
                    stepData.questions.map((question, index) => {
                      if (indexOfStopQuestion !== -1) {
                        const thisQuestionIndex =
                          useMSF.data.flattenForm.findIndex(
                            (q) => q.key === question.key
                          );
                        if (thisQuestionIndex > indexOfStopQuestion)
                          return (
                            <QuestionSkipped key={index} question={question} />
                          );
                      }
                      const answer = useMSF.answers.question(question.key);
                      return (
                        <QuestionAnswer
                          key={index}
                          question={question}
                          answer={answer}
                        />
                      );
                    })
                  }
                </div>
              ) : null}
            </motion.div>
          );
        })}
        {useMSF.controlFlow.stopped.formStoppedReason ? (
          <div className="shrink-0 flex flex-col gap-4">
            <p className="text-xl font-bold leading-none tracking-tight">
              Raison de l&apos;arrêt du questionnaire
            </p>
            <div className="w-fit rounded-sm text-base font-medium bg-secondary/40 px-4 py-3">
              {useMSF.controlFlow.stopped.formStoppedReason.reason}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const QuestionAnswer = ({
  question,
  answer,
}: {
  question: Question<QuestionType>;
  answer: Answer;
}) => {
  if (question.type === "boolean") {
    return (
      <QuestionAnswerBoolean
        question={question}
        answer={answer as BooleanAnswer}
      />
    );
  }
  if (question.type === "multiChoice") {
    return (
      <QuestionAnswerMultiChoice
        question={question}
        answer={answer as MultiStringAnswer}
      />
    );
  }
  if (question.type === "multiSelect") {
    return (
      <QuestionAnswerMultiSelect
        question={question}
        answer={answer as MultiStringAnswer}
      />
    );
  }
  if (question.type === "select") {
    return (
      <QuestionAnswerSelect
        question={question}
        answer={answer as StringAnswer}
      />
    );
  }
  if (question.type === "body") {
    return (
      <QuestionAnswerBody question={question} answer={answer as StringAnswer} />
    );
  }
  if (question.type === "terminatorButton") {
    return (
      <QuestionAnswerTerminatorButton
        question={question}
        answer={answer as BooleanAnswer}
      />
    );
  }
  return null;
};

const QuestionAnswerWrapper = ({
  question,
  children,
  className,
}: {
  question: Question<QuestionType>;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 bg-muted/5 px-4 py-3 border border-muted rounded-sm",
        className
      )}
    >
      <div className="font-medium text-foreground">{question.text}</div>
      {children}
    </div>
  );
};

const QuestionSkipped = ({
  question,
  className,
}: {
  question: Question<QuestionType>;
  className?: string;
}) => {
  return (
    <QuestionAnswerWrapper
      question={question}
      className={cn(
        "flex flex-row items-center justify-between gap-4",
        className
      )}
    >
      <div
        className={cn(
          "flex justify-center items-center bg-yellow-500 text-white rounded-full w-5 h-5 min-w-[1.25rem] min-h-[1.25rem]",
          className
        )}
      >
        <ChevronsRight className="w-4 h-4 stroke-2" />
      </div>
    </QuestionAnswerWrapper>
  );
};

const QuestionAnswerBoolean = ({
  question,
  answer,
  className,
}: {
  question: Question<"boolean">;
  answer: BooleanAnswer;
  className?: string;
}) => {
  return (
    <QuestionAnswerWrapper
      question={question}
      className={cn(
        "flex flex-row items-center justify-between gap-4",
        className
      )}
    >
      <div
        className={cn(
          "flex justify-center items-center text-white rounded-full w-5 h-5 min-w-[1.25rem] min-h-[1.25rem]",
          answer ? " bg-green-500" : "bg-destructive",
          className
        )}
      >
        {answer ? (
          <Check className="w-4 h-4 stroke-2" />
        ) : (
          <X className="w-4 h-4 stroke-2" />
        )}
      </div>
    </QuestionAnswerWrapper>
  );
};

const QuestionAnswerMultiChoice = ({
  question,
  answer,
  className,
  wrapperClassName,
  optionClassName,
  optionAnswerClassName,
}: {
  question: Question<"multiChoice">;
  answer: MultiStringAnswer;
  className?: string;
  wrapperClassName?: string;
  optionClassName?: string;
  optionAnswerClassName?: string;
}) => {
  let answers = answer;
  if (!Array.isArray(answer)) answers = [];
  return (
    <QuestionAnswerWrapper
      question={question}
      className={cn("gap-3", wrapperClassName)}
    >
      {question.options?.map(({ value, label }, index) => {
        // @ts-ignore
        const optionAnswer = answers.includes(value);
        return (
          <div
            key={index}
            className={cn(
              "flex flex-row gap-4 items-center justify-between bg-background border-muted border rounded-sm px-4 py-3",
              optionAnswerClassName
            )}
          >
            <span className={cn("text-sm", optionClassName)}>{label}</span>
            <div
              className={cn(
                "flex justify-center items-center text-white rounded-full w-5 h-5 min-w-[1.25rem] min-h-[1.25rem]",
                optionAnswer ? " bg-green-500" : "bg-destructive",
                className
              )}
            >
              {optionAnswer ? (
                <Check className="w-4 h-4 stroke-2" />
              ) : (
                <X className="w-4 h-4 stroke-2" />
              )}
            </div>
          </div>
        );
      })}
    </QuestionAnswerWrapper>
  );
};

const QuestionAnswerMultiSelect = ({
  question,
  answer,
  className,
  wrapperClassName,
}: {
  question: Question<"multiSelect">;
  answer: MultiStringAnswer;
  className?: string;
  wrapperClassName?: string;
}) => {
  let answers = answer;
  if (!Array.isArray(answer)) answers = [];
  return (
    <QuestionAnswerWrapper question={question} className={wrapperClassName}>
      {
        // @ts-ignore
        answers.length === 0 && <span>{NO_ANSWER}</span>
      }
      {question.options?.map(({ value, label }, index) =>
        // @ts-ignore
        !answers.includes(value) ? null : (
          <Badge
            key={index}
            className={cn("rounded-sm", className)}
            variant="secondary"
          >
            {label}
          </Badge>
        )
      )}
    </QuestionAnswerWrapper>
  );
};

const QuestionAnswerSelect = ({
  question,
  answer,
  className,
  wrapperClassName,
}: {
  question: Question<"select">;
  answer: StringAnswer;
  className?: string;
  wrapperClassName?: string;
}) => {
  //check the answer is in the options and get the label
  let selectAnswer = NO_ANSWER;
  if (answer) {
    const option = question.options?.find((option) => option.value === answer);
    if (option) selectAnswer = option.label;
  }
  return (
    <QuestionAnswerWrapper question={question} className={wrapperClassName}>
      <span className={cn("text-sm", className)}>{selectAnswer}</span>
    </QuestionAnswerWrapper>
  );
};

const QuestionAnswerBody = ({
  question,
  answer,
  className,
  wrapperClassName,
}: {
  question: Question<"body">;
  answer: StringAnswer;
  className?: string;
  wrapperClassName?: string;
}) => {
  return (
    <QuestionAnswerWrapper question={question} className={wrapperClassName}>
      {answer ? (
        <ul className="flex flex-col gap-2 list-disc list-inside">
          {question.options[answer as keyof typeof question.options].map(
            (item, index) => (
              <li key={index} className={cn("text-sm", className)}>
                {item}
              </li>
            )
          )}
        </ul>
      ) : (
        <span className={cn("text-sm", className)}>{NO_ANSWER}</span>
      )}
    </QuestionAnswerWrapper>
  );
};

const QuestionAnswerTerminatorButton = ({
  question,
  answer,
  className,
}: {
  question: Question<"terminatorButton">;
  answer: BooleanAnswer;
  className?: string;
}) => {
  return (
    <QuestionAnswerWrapper
      question={question}
      className={cn(
        "flex flex-row items-center justify-between gap-4",
        className
      )}
    >
      <div
        className={cn(
          "flex justify-center items-center text-white rounded-full w-5 h-5 min-w-[1.25rem] min-h-[1.25rem]",
          answer ? " bg-green-500" : "bg-destructive",
          className
        )}
      >
        {answer ? (
          <Check className="w-4 h-4 stroke-2" />
        ) : (
          <X className="w-4 h-4 stroke-2" />
        )}
      </div>
    </QuestionAnswerWrapper>
  );
};
