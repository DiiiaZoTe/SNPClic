//! Answer types

import { PathId } from "./_components/body";

/** Represents the answer to a boolean question. */
export type BooleanAnswer = boolean;

/** Represents the answer to a multiSelect or multiChoice question. */
export type MultiAnswer = string[];

/** Represents the answer to a select question. */
export type SelectAnswer = string;

export type BodyAnswer = string;

/** Union type for all answer types. */
export type Answer = BooleanAnswer | MultiAnswer | SelectAnswer | BodyAnswer | undefined;

/** Represents the answer to a question. The record key corresponds to the question key. */
export type FormAnswers = Record<string, Answer>;

//! Question types

/** Maps each question type to its corresponding answer type. */
export type QuestionTypeToAnswerMap = {
  boolean: BooleanAnswer;
  multiSelect: MultiAnswer;
  multiChoice: MultiAnswer;
  select: SelectAnswer;
  body: BodyAnswer;
};

/** Represents an option in a question. */
export type QuestionOption = { value: string; label: string };
export type QuestionBodyOption = Record<PathId, string>;

/** Enumerates the different types of questions that can be used in a form. */
export type QuestionType = "boolean" | "multiSelect" | "multiChoice" | "select" | "body";

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
};

/**
 * Specific structure for a boolean question.
 */
type BooleanQuestion = BaseQuestion<'boolean'> & {
  defaultAnswer: BooleanAnswer;
}

/**
 * Specific structure for a multiChoice question.
 */
type MultiChoiceQuestion = BaseQuestion<'multiChoice'> & {
  options: QuestionOption[];
  defaultAnswer: MultiAnswer;
};

/**
 * Specific structure for a multiSelect question.
 */
type MultiSelectQuestion = BaseQuestion<'multiSelect'> & {
  options: QuestionOption[];
  placeholder: string;
  defaultAnswer: MultiAnswer;
};

/**
 * Specific structure for a select question.
 */
type SelectQuestion = BaseQuestion<'select'> & {
  options: QuestionOption[];
  placeholder: string;
  defaultAnswer: SelectAnswer;
};

/**
 * Specific structure for a body question.
 */
type BodyQuestion = BaseQuestion<'body'> & {
  options: QuestionBodyOption;
  defaultAnswer: BodyAnswer;
};

/**
 * Union type for all question.
 */
export type Question<T extends QuestionType> =
  T extends 'boolean' ? BooleanQuestion :
  T extends 'multiChoice' ? MultiChoiceQuestion :
  T extends 'multiSelect' ? MultiSelectQuestion :
  T extends 'select' ? SelectQuestion :
  T extends 'body' ? BodyQuestion :
  never;

//! Step/Form types

export type StepCanStopFlowContent = {
  title: string;
  content: string;
  stopFlowButtonLabel?: string;
  warningStopFlowButton?: string;
  continueFlowButtonLabel?: string;
  warningContinueFlowButton?: string;
}

export type StepCanStopFlow = {
  condition: QuestionCondition | CompositeCondition;
  content: StepCanStopFlowContent;
}

/** Represents a single step in a form, including its questions. */
export type Step = {
  name: string;
  description?: string;
  questions: Array<Question<QuestionType>>;
  stopFlowCondition?: StepCanStopFlow[];
};

/** Represents the entire form as a sequence of steps. */
export type Form = Step[];

//! Utility types

/** Utility type to infer the answer type for a given question. */
export type AnswerForQuestion<Q extends Question<QuestionType>> = Q extends Question<QuestionType> ? QuestionTypeToAnswerMap[Q['type']] : never;

/** Utility type to define the direction of a step change. */
export type StepDirection = "backward" | "forward";

//! Condition logic types

/** Represents a composite condition, combining multiple conditions. */
export type CompositeCondition = {
  type: LogicalOperator;
  conditions: Array<QuestionCondition | CompositeCondition>;
};

/** Defines logical operators for combining conditions. */
export type LogicalOperator = "AND" | "OR";

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

export type QuestionConditionValue = Boolean[] | string[] | number;

/** Represents a condition based on a question's answer. */
export type QuestionCondition = {
  questionKey: string;
  operator: ConditionOperator;
  value?: QuestionConditionValue;
};