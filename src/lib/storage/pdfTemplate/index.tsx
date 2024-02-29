/* eslint-disable @next/next/no-css-tags */
/* eslint-disable @next/next/no-head-element */
/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */
import type {
  Form,
  Question,
  QuestionType,
} from "@/app/(app)/(protected)/questionnaire/types";
import type { PathId } from "@/app/(app)/(protected)/questionnaire/_components/body";
import { Check, ChevronsRight, X } from "lucide-react";
import * as styles from "./styles";

const NO_ANSWER = "Pas de réponse";

type submissionDataProps = {
  uuid: string;
  submittedAt: Date;
  stopReason?: string | null;
  stopReasonQuestionId?: string | null;
  skippedSteps: number[];
};

type answersProps = {
  questionId: string;
  answerType: "string" | "boolean" | "string_array";
  booleanAnswer?: boolean | null;
  stringAnswer?: string | null;
  stringArrayAnswer?: string[] | null;
  skipped?: boolean | null;
};

export const PDFTemplate = ({
  formData,
  submissionData,
  answers,
}: {
  formData: Form;
  submissionData: submissionDataProps;
  answers: answersProps[];
}) => {
  return (
    <html style={styles.html}>
      <head>
        <style>{styles.rootStyle}</style>
      </head>
      <body style={styles.body}>
        <header style={styles.header}>
          <Logo />
          <p>
            {`Le ${formatDate(
              submissionData.submittedAt
            )} à ${submissionData.submittedAt.toLocaleTimeString("fr-FR", {
              timeZone: "Europe/Paris",
            })} GMT+1`}
          </p>
        </header>
        <div style={styles.stepSection}>
          {formData.config.map((step, stepIndex) => {
            const stepSkipped = submissionData.skippedSteps.includes(
              stepIndex + 1
            );
            return (
              <div key={stepIndex} style={styles.step}>
                <div style={styles.stepHeader}>
                  <p style={styles.stepLabel}>{`${stepIndex + 1}. ${
                    step.name
                  }`}</p>
                  {stepSkipped && <p style={styles.skipped}>Étape sautée</p>}
                </div>
                {!stepSkipped &&
                  step.questions.map((question, questionIndex) => {
                    const answer = answers.find(
                      (a) => a.questionId === question.id
                    );
                    if (!answer) return null;
                    return (
                      <div key={questionIndex} style={styles.question}>
                        <AnswerSwitch answer={answer} question={question} />
                      </div>
                    );
                  })}
              </div>
            );
          })}
          {submissionData.stopReason && (
            <div style={styles.stopReason}>
              <span style={styles.stepLabel}>
                Raison de l&apos;arrêt du questionnaire:
              </span>
              <p style={styles.stopReasonP}>{submissionData.stopReason}</p>
            </div>
          )}
        </div>
      </body>
    </html>
  );
};

interface QuestionAnswerWrapperProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  question: Question<QuestionType>;
  answer: answersProps;
}

const QuestionAnswerWrapper = ({
  question,
  answer,
  children,
  ...props
}: QuestionAnswerWrapperProps) => {
  return (
    <div {...props}>
      <div style={styles.questionHeader}>
        <span style={styles.questionLabel}>{question.text}</span>
        {answer.skipped && <SkipMark />}
      </div>
      {!answer.skipped && <div>{children}</div>}
    </div>
  );
};

const AnswerSwitch = ({
  answer,
  question,
}: {
  answer: answersProps;
  question: Question<QuestionType>;
}) => {
  const renderNoAnswer = () => (
    <QuestionAnswerWrapper
      question={question}
      answer={answer}
      style={styles.questionCol}
    >
      <span>{NO_ANSWER}</span>
    </QuestionAnswerWrapper>
  );

  switch (question.type) {
    case "boolean":
    case "terminatorButton":
      return (
        <QuestionAnswerWrapper
          question={question}
          answer={answer}
          style={styles.questionRow}
        >
          <span>{answer.booleanAnswer ? <CheckMark /> : <XMark />}</span>
        </QuestionAnswerWrapper>
      );
    case "text":
    case "textarea":
      if (!answer.stringAnswer) return renderNoAnswer();
      return (
        <QuestionAnswerWrapper
          question={question}
          answer={answer}
          style={styles.questionCol}
        >
          <span style={{ whiteSpace: "pre-wrap" }}>{answer.stringAnswer}</span>
        </QuestionAnswerWrapper>
      );
    case "select":
      const selectedOption = question.options.find(
        (option) => option.value === answer.stringAnswer
      );
      if (!selectedOption) return renderNoAnswer();
      return (
        <QuestionAnswerWrapper
          question={question}
          answer={answer}
          style={styles.questionCol}
        >
          <span>{selectedOption.label}</span>
        </QuestionAnswerWrapper>
      );
    case "multiChoice":
      const stringValues = answer.stringArrayAnswer;
      if (
        stringValues === null ||
        stringValues === undefined ||
        !stringValues.length
      )
        return renderNoAnswer();
      return (
        <QuestionAnswerWrapper
          question={question}
          answer={answer}
          style={styles.questionCol}
        >
          <ul style={styles.ul}>
            {question.options.map((option, index) => {
              const isSelected = stringValues.includes(option.value);
              return (
                <li
                  key={index}
                  style={{ ...styles.li, ...styles.rowAlignCenter }}
                >
                  {isSelected ? <CheckMark /> : <XMark />} {option.label}
                </li>
              );
            })}
          </ul>
        </QuestionAnswerWrapper>
      );
    case "multiSelect":
      const selectedOptions = question.options.filter((option) =>
        answer.stringArrayAnswer?.includes(option.value)
      );
      if (!selectedOptions.length) return renderNoAnswer();
      return (
        <QuestionAnswerWrapper
          question={question}
          answer={answer}
          style={styles.questionCol}
        >
          <ul style={styles.ul}>
            {selectedOptions.map((option, index) => (
              <li key={index} style={styles.li}>
                {option.label}
              </li>
            ))}
          </ul>
        </QuestionAnswerWrapper>
      );
    case "body":
      if (!answer.stringAnswer) return renderNoAnswer();
      const bodyPart = answer.stringAnswer as PathId;
      const bodyValues = question.options[bodyPart];
      return (
        <QuestionAnswerWrapper
          question={question}
          answer={answer}
          style={styles.questionCol}
        >
          <p>
            Partie du corps:
            <span>{bodyPart}</span>
          </p>
          <ul style={styles.ul}>
            {bodyValues.map((value, index) => (
              <li key={index} style={styles.li}>
                {value}
              </li>
            ))}
          </ul>
        </QuestionAnswerWrapper>
      );
  }
};

const Logo = () => (
  <div style={styles.logo}>
    <h1 style={styles.logoH1}>
      SNP<span style={styles.logoSpan}> · Clic</span>
    </h1>
    <svg viewBox="0 0 1024 1024" style={styles.logomark}>
      <path
        style={styles.logomarkPath1}
        d="m1004.78,360.46h-322.02c-10.61,0-19.22-8.6-19.22-19.22V19.22c0-10.61-8.6-19.22-19.22-19.22h-180.49c-10.61,0-19.22,8.6-19.22,19.22v322.02c0,10.61-8.6,19.22-19.22,19.22H103.37c-10.61,0-19.22,8.6-19.22,19.22v180.49c0,10.61,8.6,19.22,19.22,19.22h54.32l311.06-113.21c7.67-2.79,15.69-4.21,23.82-4.21,22.62,0,43.89,11.1,56.91,29.69,12.98,18.53,16.1,42.31,8.35,63.6l-113.22,311.06v54.33c0,10.61,8.6,19.22,19.22,19.22h180.49c10.61,0,19.22-8.6,19.22-19.22v-322.02c0-10.61,8.6-19.22,19.22-19.22h322.02c10.61,0,19.22-8.6,19.22-19.22v-180.49c0-10.61-8.6-19.22-19.22-19.22Z"
      />
      <path
        style={styles.logomarkPath2}
        d="m6.28,716.22l217.51,78.27c2.66.96,4.76,3.06,5.72,5.72l78.27,217.51c3.01,8.36,14.82,8.38,17.86.03l175.81-483.02c2.76-7.58-4.59-14.93-12.17-12.17L6.25,698.36c-8.35,3.04-8.33,14.85.03,17.86Z"
      />
    </svg>
  </div>
);

const CheckMark = () => {
  return (
    <div>
      <Check
        color="var(--primary)"
        style={{ minWidth: "1rem", minHeight: "1rem" }}
      />
    </div>
  );
};

const XMark = () => {
  return (
    <div>
      <X
        color="var(--destructive)"
        style={{ minWidth: "1rem", minHeight: "1rem" }}
      />
    </div>
  );
};

const SkipMark = () => {
  return (
    <div>
      <ChevronsRight
        color="var(--foreground)"
        style={{ minWidth: "1rem", minHeight: "1rem" }}
      />
    </div>
  );
};

const formatDate = (date: Date) => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
