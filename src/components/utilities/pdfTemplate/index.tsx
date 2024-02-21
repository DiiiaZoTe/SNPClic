/* eslint-disable @next/next/no-css-tags */
/* eslint-disable @next/next/no-head-element */
/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */
import type { Form, Question, QuestionType } from "@/app/questionnaire/types";
import type { PathId } from "@/app/questionnaire/_components/body";
import { Check, ChevronsRight, X } from "lucide-react";

const NO_ANSWER = "Pas de réponse";

type submissionDataProps = {
  uuid: string;
  submitted_at: Date;
  stop_reason?: string | null;
  stop_reason_question_id?: string | null;
  skipped_steps: number[];
};

type answersProps = {
  question_id: string;
  answer_type: "string" | "boolean" | "string_array";
  boolean_answer?: boolean | null;
  string_answer?: string | null;
  string_array_answer?: string[] | null;
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
    <html>
      <head>
        <style>{`
:root {
  --primary: #10a847;
  --background: #ffffff;
  --foreground: #262626;
  --destructive: #e60000;
  --muted: #767676;
  --very-light: #fdfdfd;
  --light: #ececec;

  --size-1: 0.25rem;
  --size-2: 0.5rem;
  --size-3: 0.75rem;
  --size-4: 1rem;
  --size-8: 2rem;
  --size-16: 4rem;

  --font-size-sm: 0.875rem;
  --font-size-sm-line-height: 1.25rem;
  --font-size-base: 1rem;
  --font-size-base-line-height: 1.50rem;
  --font-size-lg: 1.25rem;
  --font-size-lg-line-height: 1.65rem;
  --font-size-xl: 1.5rem;
  --font-size-xl-line-height: 1.75rem;
  --font-size-4xl: 2.25rem;
  --font-size-4xl-line-height: 2.5rem;

  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}

@page {
  margin: 1.5cm;
}

* {
  font-family: sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-normal);
}

html {
  -webkit-print-color-adjust: exact;
}

body {
  font-size: 1rem;
  color: var(--foreground);
  background-color: var(--background);
  display: flex;
  flex-direction: column;
  gap: var(--size-8);
  font-size: var(--font-size-base);
}

header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: var(--size-4);
}

ul {
  list-style: disc;
  list-style-position: inside;
  margin-left: var(--size-2);
}

li {
  font-size: var(--font-size-sm);
}

/* ------------------ Logo Section ------------------ */
#logo {
  display: flex;
  align-items: center;
  gap: var(--size-4);
}
#logo h1 {
  color: var(--primary);
  font-size: var(--font-size-4xl);
  font-weight: 700;
  letter-spacing: -0.025em;
}
#logo span {
  font-size: var(--font-size-4xl);
  color: var(--foreground);
  font-weight: 700;
}
#logomark {
  width: var(--size-8);
  height: var(--size-8);
}
#logomark path:nth-child(1) {
  fill: var(--primary);
}
#logomark path:nth-child(2) {
  fill: var(--foreground);
}

/* ------------------ Step Section ------------------ */
#stepSection {
  display: flex;
  flex-direction: column;
  gap: var(--size-4);
}
.step {
  display: flex;
  flex-direction: column;
  gap: var(--size-2);
}
.stepHeader {
  display: flex;
  flex-direction: row;
  gap: var(--size-4);
  justify-content: space-between;
  align-items: center;
}
.stepLabel {
  font-weight: var(--font-semibold);
  font-size: var(--font-size-base);
}

/* ------------------ Question Section ------------------ */
.question {
  padding: var(--size-2);
  border-radius: var(--size-1);
  border: 0.5px solid var(--light);
  background-color: var(--very-light);
  color: var(--muted);
}

.questionCol{
  display: flex;
  flex-direction: column;
  gap: var(--size-1);
}
.questionRow{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: var(--size-4);
}

.questionHeader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: var(--size-4);
  width: 100%;
}

.questionLabel {
  font-weight: var(--font-medium);
  font-size: var(--font-size-base);
  color: var(--foreground);
}

/* ------------------ Answeer Section ------------------ */
.bodyAnswer {
  display: flex;
  flex-direction: column;
  gap: var(--size-1);
}

.bodyAnswer span {
  font-weight: var(--font-medium);
}

/* ------------------ Stop Reason Section ------------------ */
#stopReason {
  display: flex;
  flex-direction: column;
  gap: var(--size-2);
}
#stopReason p {
  font-weight: var(--font-medium);
  padding: var(--size-2);
  border-radius: var(--size-1);
  background-color: var(--light);
  color: var(--foreground);
}

/* ------------------ Global Styles ------------------ */
.skipped {
  padding: var(--size-1);
  border-radius: var(--size-1);
  background-color: var(--light);
  color: var(--foreground);
  font-size: var(--font-size-sm);
}

.row-align-center {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--size-2);
}
        `}</style>
      </head>
      <body>
        <header>
          <div id="logo">
            <h1>
              SNP<span> · Clic</span>
            </h1>
            <svg viewBox="0 0 1024 1024" id="logomark">
              <path d="m1004.78,360.46h-322.02c-10.61,0-19.22-8.6-19.22-19.22V19.22c0-10.61-8.6-19.22-19.22-19.22h-180.49c-10.61,0-19.22,8.6-19.22,19.22v322.02c0,10.61-8.6,19.22-19.22,19.22H103.37c-10.61,0-19.22,8.6-19.22,19.22v180.49c0,10.61,8.6,19.22,19.22,19.22h54.32l311.06-113.21c7.67-2.79,15.69-4.21,23.82-4.21,22.62,0,43.89,11.1,56.91,29.69,12.98,18.53,16.1,42.31,8.35,63.6l-113.22,311.06v54.33c0,10.61,8.6,19.22,19.22,19.22h180.49c10.61,0,19.22-8.6,19.22-19.22v-322.02c0-10.61,8.6-19.22,19.22-19.22h322.02c10.61,0,19.22-8.6,19.22-19.22v-180.49c0-10.61-8.6-19.22-19.22-19.22Z" />
              <path d="m6.28,716.22l217.51,78.27c2.66.96,4.76,3.06,5.72,5.72l78.27,217.51c3.01,8.36,14.82,8.38,17.86.03l175.81-483.02c2.76-7.58-4.59-14.93-12.17-12.17L6.25,698.36c-8.35,3.04-8.33,14.85.03,17.86Z" />
            </svg>
          </div>
          <p>
            {`Le ${formatDate(
              submissionData.submitted_at
            )} à ${submissionData.submitted_at.toLocaleTimeString("fr-FR", {
              timeZone: "Europe/Paris",
            })} GMT+1`}
          </p>
        </header>
        <div id="stepSection">
          {formData.config.map((step, stepIndex) => {
            const stepSkipped = submissionData.skipped_steps.includes(
              stepIndex + 1
            );
            return (
              <div key={stepIndex} className="step">
                <div className="stepHeader">
                  <p className="stepLabel">{`${stepIndex + 1}. ${
                    step.name
                  }`}</p>
                  {stepSkipped && <p className="skipped">Étape sautée</p>}
                </div>
                {!stepSkipped &&
                  step.questions.map((question, questionIndex) => {
                    const answer = answers.find(
                      (a) => a.question_id === question.id
                    );
                    if (!answer) return null;
                    return (
                      <div key={questionIndex} className="question">
                        <AnswerSwitch answer={answer} question={question} />
                      </div>
                    );
                  })}
              </div>
            );
          })}
          {submissionData.stop_reason && (
            <div id="stopReason">
              <span className="stepLabel">
                Raison de l&apos;arrêt du questionnaire:
              </span>
              <p>{submissionData.stop_reason}</p>
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
      <div className="questionHeader">
        <span className="questionLabel">{question.text}</span>
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
      className="questionCol"
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
          className="questionRow"
        >
          <span>{answer.boolean_answer ? <CheckMark /> : <XMark />}</span>
        </QuestionAnswerWrapper>
      );
    case "text":
    case "textarea":
      if (!answer.string_answer) return renderNoAnswer();
      return (
        <QuestionAnswerWrapper
          question={question}
          answer={answer}
          className="questionCol"
        >
          <span style={{ whiteSpace: "pre-wrap" }}>{answer.string_answer}</span>
        </QuestionAnswerWrapper>
      );
    case "select":
      const selectedOption = question.options.find(
        (option) => option.value === answer.string_answer
      );
      if (!selectedOption) return renderNoAnswer();
      return (
        <QuestionAnswerWrapper
          question={question}
          answer={answer}
          className="questionCol"
        >
          <span>{selectedOption.label}</span>
        </QuestionAnswerWrapper>
      );
    case "multiChoice":
      const stringValues = answer.string_array_answer;
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
          className="questionCol"
        >
          <ul>
            {question.options.map((option, index) => {
              const isSelected = stringValues.includes(option.value);
              return (
                <li key={index} className="row-align-center">
                  {isSelected ? <CheckMark /> : <XMark />} {option.label}
                </li>
              );
            })}
          </ul>
        </QuestionAnswerWrapper>
      );
    case "multiSelect":
      const selectedOptions = question.options.filter((option) =>
        answer.string_array_answer?.includes(option.value)
      );
      if (!selectedOptions.length) return renderNoAnswer();
      return (
        <QuestionAnswerWrapper
          question={question}
          answer={answer}
          className="questionCol"
        >
          <ul>
            {selectedOptions.map((option, index) => (
              <li key={index}>{option.label}</li>
            ))}
          </ul>
        </QuestionAnswerWrapper>
      );
    case "body":
      if (!answer.string_answer) return renderNoAnswer();
      const bodyPart = answer.string_answer as PathId;
      const bodyValues = question.options[bodyPart];
      return (
        <QuestionAnswerWrapper
          question={question}
          answer={answer}
          className="questionCol"
        >
          <p>
            Partie du corps:
            <span>{bodyPart}</span>
          </p>
          <ul>
            {bodyValues.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        </QuestionAnswerWrapper>
      );
  }
};

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
