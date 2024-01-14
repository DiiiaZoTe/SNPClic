import * as z from "zod";
import type {
  Answer,
  FormAnswers,
  Form,
  Step,
  StepDirection,
} from "../types";
import { evaluateCondition } from "./conditions";
import { getDefaultStore } from "jotai";
import { formAnswersAtom } from "../_hooks/atom";

export const getStepZodSchema = (step: Step) => {
  let schema: Record<string, z.ZodType<Answer, any, any>> = {};
  step.questions.forEach((question) => {
    switch (question.type) {
      case "boolean":
        // always required for boolean but we have a default value
        schema[question.key] = z
          .boolean()
          .default(question.defaultAnswer)
        break;
      case "multiChoice":
      case "multiSelect":
        schema[question.key] = z
          .array(z.string())
          .default(question.defaultAnswer)
        break;
      case "select":
        schema[question.key] = z
          .string()
          .default(question.defaultAnswer)
        break;
      case "body":
        schema[question.key] = z
          .string()
          .default(question.defaultAnswer)
        break;
      default:
        throw new Error(`Type de question inconnu`);
    }
  });
  const fullSchema = z.object(schema).superRefine((values, ctx) => {
    const fullValues = getDefaultStore().get(formAnswersAtom);
    step.questions.forEach((question) => {
      // check if the question is required
      let isRequired = question.isRequired; 
      // if the question is required and has a display condition, check if the condition is met
      if (isRequired && question.displayCondition) {
        isRequired = evaluateCondition(question.displayCondition, fullValues);
      }
      switch (question.type) {
        case "multiChoice":
        case "multiSelect":
          const multiAnswer = values[question.key] as string[];
          if (isRequired && multiAnswer.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Ajouter au moins une valeur.',
              path: [question.key]
            });
          }
          if (!multiAnswer.every((v) => question.options.some((option) => option.value === v)))
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Une valeur non valide a été ajoutée.',
              path: [question.key]
            });
          break;
        case "select":
          const selectAnswer = values[question.key] as string;
          if (isRequired && selectAnswer.length === 0)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Ajouter une valeur.',
              path: [question.key]
            });
          if (selectAnswer !== question.defaultAnswer && !question.options.some((option) => option.value === selectAnswer))
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Ajouter une valeur valide.',
              path: [question.key]
            });
          break;
        case "body":
          const bodyAnswer = values[question.key] as string;
          if (isRequired && bodyAnswer.length === 0)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Sélectionner une partie du corps.',
              path: [question.key]
            });
          break;
      }
    });
  });
  return fullSchema
};

/** Get the form data as a flat array of questions */
export const flattenFormData = (data: Form) => {
  return data.flatMap((step) => step.questions);
}

/** Get the default values for the form */
export const getFormDefaultValues = (data: Form): FormAnswers => {
  return data.reduce((acc, step) => {
    step.questions.forEach((question) => {
      acc[question.key] = question.defaultAnswer;
    });
    return acc;
  }, {} as FormAnswers);
}

/** Get the answers for a specific step */
export const getStepAnswers = (stepData: Step, formAnswers: FormAnswers) => {
  return stepData.questions.reduce((acc, question) => {
    acc[question.key] = formAnswers[question.key];
    return acc;
  }, {} as FormAnswers);
}


/** Scroll to allow the element to be visible */
export const scrollToViewIfNeeded = (ref?: React.RefObject<HTMLElement>) => {
  if (!ref) return false;
  if (!ref.current) return false;
  const rect = ref.current.getBoundingClientRect();
  if (rect.top >= 0 && rect.top <= window.innerHeight) return;
  ref.current?.scrollIntoView({
    behavior: "smooth",
  });
};

/** Constants for the step form animation */
const X_FORM_MOVE = 200;
/** Variants for the step form animation */
export const stepFormVariants = {
  enter: (direction: StepDirection) => ({
    x: direction === "forward" ? X_FORM_MOVE : -X_FORM_MOVE,
    opacity: 0,
    transition: {
      delay: 0.2,
    },
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
  exit: (direction: StepDirection) => ({
    zIndex: 0,
    x: direction === "backward" ? X_FORM_MOVE : -X_FORM_MOVE,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  }),
};
