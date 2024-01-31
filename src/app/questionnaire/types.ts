//! Answer types

import { ButtonVariantsType } from "@/components/ui/button";
import { PathId } from "./_components/body";

/** Represents the answer to a boolean question. */
export type BooleanAnswer = boolean;

/** Represents the answer to a multiSelect or multiChoice question. */
export type MultiStringAnswer = string[];

/** Represents the answer to a select question. */
export type StringAnswer = string;

/** Union type for all answer types. */
export type Answer = BooleanAnswer | MultiStringAnswer | StringAnswer | undefined;

/** Represents the answer to a question. The record key corresponds to the question key. */
export type FormAnswers = Record<string, Answer>;

//! Question types

/** Maps each question type to its corresponding answer type. */
export type QuestionTypeToAnswerMap = {
  text: StringAnswer;
  textarea: StringAnswer;
  boolean: BooleanAnswer;
  multiSelect: MultiStringAnswer;
  multiChoice: MultiStringAnswer;
  select: StringAnswer;
  body: StringAnswer;
  terminatorButton: BooleanAnswer;
};

/** Represents an option in a question. */
export type QuestionOption = { value: string; label: string };
export type QuestionBodyOption = Record<PathId, string[]>;

/** Enumerates the different types of questions that can be used in a form. */
export type QuestionType = keyof QuestionTypeToAnswerMap;

/** Represents a question info display condition. */
export type QuestionInfoCondition = {
  info: string;
  condition: QuestionCondition | CompositeCondition;
}[];

/** Base structure for a question.  Generic T extends QuestionType for specific question type enforcement. */
export type BaseQuestion<T extends QuestionType> = {
  text: string;
  key: string;
  type: T;
  isRequired: boolean;
  description?: string;
  popupInfo?: string;
  displayCondition?: QuestionCondition | CompositeCondition;
  dependents?: string[];
  infoCondition?: QuestionInfoCondition;
};

/** Specific structure for a text question. */
type TextQuestion = BaseQuestion<'text'> & {
  defaultAnswer: StringAnswer;
}

/** Specific structure for a textarea question. */
type TextareaQuestion = BaseQuestion<'textarea'> & {
  defaultAnswer: StringAnswer;
}

/** Specific structure for a boolean question. */
type BooleanQuestion = BaseQuestion<'boolean'> & {
  defaultAnswer: BooleanAnswer;
}

/** Specific structure for a multiChoice question. */
type MultiChoiceQuestion = BaseQuestion<'multiChoice'> & {
  options: QuestionOption[];
  defaultAnswer: MultiStringAnswer;
};

/** Specific structure for a multiSelect question. */
type MultiSelectQuestion = BaseQuestion<'multiSelect'> & {
  options: QuestionOption[];
  placeholder: string;
  defaultAnswer: MultiStringAnswer;
};

/** Specific structure for a select question. */
type SelectQuestion = BaseQuestion<'select'> & {
  options: QuestionOption[];
  placeholder: string;
  defaultAnswer: StringAnswer;
};

/** Specific structure for a body question. */
type BodyQuestion = BaseQuestion<'body'> & {
  options: QuestionBodyOption;
  defaultAnswer: StringAnswer;
};

/** Specific structure for a terminator button question. */
type TerminatorButtonQuestion = BaseQuestion<'terminatorButton'> & {
  buttonLabel?: string;
  defaultAnswer: BooleanAnswer;
  variant: ButtonVariantsType;
  stopFlowContent: CanStopFlowContent;
};

/** Union type for all question. */
export type Question<T extends QuestionType> =
  T extends 'text' ? TextQuestion :
  T extends 'textarea' ? TextareaQuestion :
  T extends 'boolean' ? BooleanQuestion :
  T extends 'multiChoice' ? MultiChoiceQuestion :
  T extends 'multiSelect' ? MultiSelectQuestion :
  T extends 'select' ? SelectQuestion :
  T extends 'body' ? BodyQuestion :
  T extends 'terminatorButton' ? TerminatorButtonQuestion :
  never;

//! Step/Form types

/** Represents a single step in a form, including its questions. */
export type Step = {
  name: string;
  description?: string;
  questions: Array<Question<QuestionType>>;
  continueLabel?: string;
  noContinueButton?: boolean;
  stopFlowCondition?: StepCanStopFlow[];
};

/** Represents the entire form as a sequence of steps. */
export type Form = Step[];

//! Control flow types

/** Represents a button of a step stop flow. */
type StopFlowButtonBase = {
  label: string;
  preText?: string;
  postText?: string;
  variant?: ButtonVariantsType;
};

/** Represents the stop button of a step stop flow. */
export type StopFlowButton = StopFlowButtonBase & {
  reason: string;
};

/** Represents the continue button of a step stop flow. */
export type ContinueFlowButton = StopFlowButtonBase & {
  continueToStep?: number;
};

/** Represents the cancel button of a step stop flow. */
export type CancelFlowButton = StopFlowButtonBase;

/** Represents the stop content of a step. */
export type CanStopFlowContent = {
  title?: string;
  questionKey?: string;
  bypassModalStopReason?: string | true;
  content?: string;
  stopFlowButtons?: StopFlowButton[];
  continueFlowButton?: ContinueFlowButton;
  cancelFlowButton?: CancelFlowButton;
  continueToStep?: number; // ? if we want multiple continue buttons, add this to the continueFlowButton
}

/** Represents the stop condition + content of a step. */
export type StepCanStopFlow = {
  condition: QuestionCondition | CompositeCondition | true;
  content: CanStopFlowContent;
}

/** Represents the reason for stopping a flow. */
export type StopFlowReason = { reason: string, questionKey?: string } | undefined;

//! Utility types

/** Utility type to infer the answer type for a given question. */
export type AnswerForQuestion<Q extends Question<QuestionType>> = Q extends Question<QuestionType> ? QuestionTypeToAnswerMap[Q['type']] : never;

/** Utility type to define the direction of a step change. */
export type StepDirection = "backward" | "forward";

export type StepVisited = "visited" | "notVisited" | "skipped";

//! Condition logic types

/** Represents a composite condition, combining multiple conditions. */
export type CompositeCondition = {
  type: LogicalOperator;
  conditions: Array<QuestionCondition | CompositeCondition>;
};

/** Defines logical operators for combining conditions. */
export type LogicalOperator = "AND" | "OR";

/** Defines operators for comparing selected numbers. */
export type SelectedNumberOperator =
  "SELECTED_EQUALS" |
  "SELECTED_NOT_EQUALS" |
  "SELECTED_LESS_THAN" |
  "SELECTED_LESS_THAN_OR_EQUALS" |
  "SELECTED_GREATER_THAN" |
  "SELECTED_GREATER_THAN_OR_EQUALS";

/** Defines the operators used in question conditions. */
export type ConditionOperator =
  "EQUALS" | "NOT_EQUALS" |
  "IS_ALL_IN" | "NOT_IS_ALL_IN" |
  "IS_ANY_IN" | "NOT_IS_ANY_IN" |
  "IS_EMPTY" | "NOT_IS_EMPTY" |
  SelectedNumberOperator;

/** Defines the possible values for a question condition. */
export type QuestionConditionValue = Boolean[] | string[] | number;

/** Represents a condition based on a question's answer. */
export type QuestionCondition = {
  questionKey: string;
  operator: ConditionOperator;
  value?: QuestionConditionValue;
};