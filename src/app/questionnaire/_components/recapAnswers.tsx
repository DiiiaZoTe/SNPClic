"use client";

import { ReactNode } from "react";

import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  QuestionType,
  Question,
  BodyAnswer,
  SelectAnswer,
  MultiAnswer,
  BooleanAnswer,
} from "../types";
import { useMultiStepFormContext } from "../_hooks/multiStepFormContext";

import { Badge } from "@/components/ui/badge";

export const RecapAnswers = () => {
  const useMSF = useMultiStepFormContext();
  return (
    <div className="p-0 flex flex-col gap-4 w-full h-full max-w-[calc(100svw-4rem)] sm:max-w-xl animate-[in_0.5s_ease-in-out] ">
      <div className="shrink-0 flex flex-col gap-4">
        <p className="text-xl font-bold leading-none tracking-tight">
          Vérification
        </p>
        <p className="text-sm text-muted-foreground">
          Vérifier la validité de vos réponses.
        </p>
      </div>
      <div className="grow overflow-y-auto scrollbar flex flex-col gap-8 pr-2 pb-2">
        {useMSF.data.form.map((stepData, i) => {
          // only show the steps before or equal to the current step
          if (i > useMSF.stepper.currentStep - 1) return null;
          return (
            <div key={i} className="flex flex-col gap-2">
              <div className="font-semibold text-foreground">
                {i + 1}. {useMSF.data.form[i].name}
              </div>
              <div className="flex flex-col gap-2">
                {/* get the questions and the answers in text format*/}
                {stepData.questions.map((question, index) => {
                  // const answer = stepAnswer[question.key];
                  const answer = useMSF.answers.question(question.key);
                  if (question.type === "boolean") {
                    return (
                      <QuestionAnswerBoolean
                        key={index}
                        question={question}
                        answer={answer as BooleanAnswer}
                      />
                    );
                  }
                  if (question.type === "multiChoice") {
                    return (
                      <QuestionAnswerMultiChoice
                        key={index}
                        question={question}
                        answer={answer as MultiAnswer}
                      />
                    );
                  }
                  if (question.type === "multiSelect") {
                    return (
                      <QuestionAnswerMultiSelect
                        key={index}
                        question={question}
                        answer={answer as MultiAnswer}
                      />
                    );
                  }
                  if (question.type === "select") {
                    return (
                      <QuestionAnswerSelect
                        key={index}
                        question={question}
                        answer={answer as SelectAnswer}
                      />
                    );
                  }
                  if (question.type === "body") {
                    return (
                      <QuestionAnswerBody
                        key={index}
                        question={question}
                        answer={answer as BodyAnswer}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          );
        })}
        {useMSF.submission.stopFlow.formStoppedReason ? (
          <div className="shrink-0 flex flex-col gap-4">
            <p className="text-xl font-bold leading-none tracking-tight">
              Raison de l&apos;arrêt du formulaire
            </p>
            <p className="text-sm text-muted-foreground">
              {useMSF.submission.stopFlow.formStoppedReason}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const NO_ANSWER = "Aucune réponse";

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
        "flex flex-col gap-1 bg-muted/10 px-4 py-3 border border-muted rounded-sm",
        className
      )}
    >
      <div className="font-medium text-foreground">{question.text}</div>
      {children}
    </div>
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
  answer: MultiAnswer;
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
  answer: MultiAnswer;
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
  answer: SelectAnswer;
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
  answer: BodyAnswer;
  className?: string;
  wrapperClassName?: string;
}) => {
  //check the answer is in the options and get the label
  let bodyAnswer = NO_ANSWER;
  if (answer) {
    bodyAnswer = question.options[answer as keyof typeof question.options];
  }
  return (
    <QuestionAnswerWrapper question={question} className={wrapperClassName}>
      <span className={cn("text-sm", className)}>{bodyAnswer}</span>
    </QuestionAnswerWrapper>
  );
};
