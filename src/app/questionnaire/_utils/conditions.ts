import { Answer, CompositeCondition, FormAnswers, LogicalOperator, QuestionCondition, QuestionConditionValue } from "../types";


/** Function to create a basic question condition */
export const createQuestionCondition = (questionCondition: QuestionCondition) => {
  return questionCondition;
};

/** Helper function to create a composite condition */
const createCompositeCondition = (type: LogicalOperator, conditions: Array<QuestionCondition | CompositeCondition>): CompositeCondition => {
  return { type, conditions };
};

/** Helper function to create an AND condition. */
export const andCondition = (...conditions: Array<QuestionCondition | CompositeCondition>) => createCompositeCondition("AND", conditions);
/** Helper function to create an OR condition. */
export const orCondition = (...conditions: Array<QuestionCondition | CompositeCondition>) => createCompositeCondition("OR", conditions);

/** Function to determine if question condition */
function isQuestionCondition(condition: QuestionCondition | CompositeCondition): condition is QuestionCondition {
  return (condition as QuestionCondition).questionKey !== undefined;
}

/**
 * Function to evaluate a condition. Can be used to check if a question should be displayed or not.
 * @param condition The condition to evaluate.
 * @param answers The entire step answers to use for evaluation.
 * @returns True if the condition is met, false otherwise.
 */
export const evaluateCondition = (condition: QuestionCondition | CompositeCondition, answers: FormAnswers): boolean => {
  if (isQuestionCondition(condition)) {
    // for the condition question, get the actual answer
    const answer = answers[condition.questionKey];
    // The answer can't be undefined, because we have a default value for each question
    if (answer === undefined) return false;
    // since condition.value is optional for certain operators, we need to make sure it's not undefined for type checking
    if (condition.value === undefined) condition.value = [];
    switch (condition.operator) {
      case "EQUALS":
        return equalsEvaluation(answer, condition.value);
      case "NOT_EQUALS":
        return !equalsEvaluation(answer, condition.value);
      case "IS_ALL_IN":
        return isAllEvaluation(answer, condition.value);
      case "NOT_IS_ALL_IN":
        return !isAllEvaluation(answer, condition.value);
      case "IS_ANY_IN":
        return isAnyEvaluation(answer, condition.value);
      case "NOT_IS_ANY_IN":
        return !isAnyEvaluation(answer, condition.value)
      case "IS_EMPTY":
        return isEmptyEvaluation(answer);
      case "NOT_IS_EMPTY":
        return !isEmptyEvaluation(answer);
      default: // something else... we don't know what to do with it
        return false;
    }
  }
  // Composite condition
  const results = condition.conditions.map(cond => evaluateCondition(cond, answers));
  return condition.type === "AND" ? results.every(Boolean) : results.some(Boolean);
};

/** Evaluate equality */
const equalsEvaluation = (answer: Answer, conditionValue: QuestionConditionValue): boolean => {
  if (!Array.isArray(conditionValue)) return false;
  if (!Array.isArray(answer)) return helperIsNonArrayValue(answer, conditionValue, false);
  // below, answer is array
  if (conditionValue.length === 0) return HelperAllMustBeUndefined(answer);
  // below conditionValue is not empty
  if (answer.length === 0)
    // @ts-ignore typescript doesn't like the every function
    return conditionValue.every(val => val === undefined || val === null || val === "");
  if (answer.length !== conditionValue.length) return false;
  return answer.every(val => conditionValue.includes(val as any));
}

/** Evaluate contains all */
const isAllEvaluation = (answer: Answer, conditionValue: QuestionConditionValue): boolean => {
  if (!Array.isArray(conditionValue)) return false;
  if (!Array.isArray(answer)) return helperIsNonArrayValue(answer, conditionValue);
  // below, answer is array
  if (conditionValue.length === 0) return HelperAllMustBeUndefined(answer);
  if (answer.length === 0)
    // @ts-ignore typescript doesn't like the every function
    return conditionValue.every(val => val === undefined || val === null || val === "");
  if (answer.length > conditionValue.length) return false; // here some answers wouln't be included
  return answer.every(val => conditionValue.includes(val as any));
}

/** Evaluate contains any */
const isAnyEvaluation = (answer: Answer, conditionValue: QuestionConditionValue): boolean => {
  if (!Array.isArray(conditionValue)) return false;
  if (!Array.isArray(answer)) return helperIsNonArrayValue(answer, conditionValue);
  // below, answer is array
  if (conditionValue.length === 0) return HelperAllMustBeUndefined(answer);
  if (answer.length === 0)
    // @ts-ignore typescript doesn't like the every function
    return conditionValue.every(val => val === undefined || val === null || val === "");
  return answer.some(val => conditionValue.includes(val as any));
}

/** Evaluate empty */
const isEmptyEvaluation = (answer: Answer): boolean => {
  if (Array.isArray(answer))
    return answer.length === 0 || answer.every(val => val === undefined || val === null || val === "");
  return answer === undefined || answer === null || answer === "";
}

/** Helper function to evaluate non array values */
const helperIsNonArrayValue = (answer: Answer, conditionValue: QuestionConditionValue, includes = true): boolean => {
  // conditionValue is empty then only an empty answer is valid
  if (conditionValue.length === 0)
    // @ts-ignore typescript doesn't like the every function
    return answer == "" || answer === undefined || answer === null;
  // conditionValue is not empty, so answer must be in conditionValue
  if (includes) return conditionValue.includes(answer as any);
  // below would be for equalsEvaluation
  if (conditionValue.length > 1) return false; // only one value expected
  return conditionValue[0] === answer;
}

/** Helper function to evaluate if all answers are undefined */
const HelperAllMustBeUndefined = (answer: string[]): boolean => {
  if (answer.length === 0) return true;
  if (answer.every(val => val === undefined || val === null || val === "")) return true;
  return false;
}