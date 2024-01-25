"use client";

import { ReactNode, use } from "react";

import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  QuestionType,
  Question,
  StringAnswer,
  MultiStringAnswer,
  BooleanAnswer,
} from "../types";
import { useMultiStepFormContext } from "../_hooks/multiStepFormContext";

import { Badge } from "@/components/ui/badge";
export const RecapAnswers = () => {
  const useMSF = useMultiStepFormContext();

  const indexOfStopQuestion = useMSF.data.flattenForm.findIndex(
    (question) =>
      useMSF.controlFlow.stopped.formStoppedReason?.questionKey &&
      question.key === useMSF.controlFlow.stopped.formStoppedReason.questionKey
  );

  return (
    <div className="p-0 flex flex-col gap-8 w-full h-full max-w-xl animate-[in_0.5s_ease-in-out] ">
      <div className="shrink-0 flex flex-col gap-4">
        <p className="text-xl font-bold leading-none tracking-tight">
          Récapitulatif
        </p>
        <p className="text-sm text-muted-foreground">
          Vérifier la validité de vos réponses.
        </p>
      </div>
      <div className="grow overflow-y-auto flex flex-col gap-8">
        {useMSF.data.form.map((stepData, i) => {
          // only show the steps before or equal to the current step
          if (i > useMSF.stepper.currentStep - 1) return null;
          return (
            <div key={i} className="flex flex-col gap-2">
              <div className="font-semibold text-foreground">
                {i + 1}. {useMSF.data.form[i].name}
              </div>
              <div className="flex flex-col gap-2">
                {/* get the question and the answer in text format*/}
                {stepData.questions.map((question, index) => {
                  if (indexOfStopQuestion !== -1) {
                    const thisQuestionIndex = useMSF.data.flattenForm.findIndex(
                      (q) => q.key === question.key
                    );
                    if (thisQuestionIndex > indexOfStopQuestion) return null;
                  }
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
                        answer={answer as MultiStringAnswer}
                      />
                    );
                  }
                  if (question.type === "multiSelect") {
                    return (
                      <QuestionAnswerMultiSelect
                        key={index}
                        question={question}
                        answer={answer as MultiStringAnswer}
                      />
                    );
                  }
                  if (question.type === "select") {
                    return (
                      <QuestionAnswerSelect
                        key={index}
                        question={question}
                        answer={answer as StringAnswer}
                      />
                    );
                  }
                  if (question.type === "body") {
                    return (
                      <QuestionAnswerBody
                        key={index}
                        question={question}
                        answer={answer as StringAnswer}
                      />
                    );
                  }
                  if (question.type === "terminatorButton") {
                    return (
                      <QuestionAnswerTerminatorButton
                        key={index}
                        answer={answer as BooleanAnswer}
                        question={question}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          );
        })}
        {useMSF.controlFlow.stopped.formStoppedReason ? (
          <div className="shrink-0 flex flex-col gap-4">
            <p className="text-xl font-bold leading-none tracking-tight">
              Raison de l&apos;arrêt du questionnaire
            </p>
            <Badge variant="secondary" className="w-fit rounded-sm text-base font-medium">
              {useMSF.controlFlow.stopped.formStoppedReason.reason}
            </Badge>
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
        "flex flex-col gap-1 bg-muted/5 px-4 py-3 border border-muted rounded-sm",
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
