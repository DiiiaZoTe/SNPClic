import * as z from "zod";
import type {
  Answer,
  Step,
} from "../types";
import { evaluateCondition } from "../_utils/conditions";
import { getDefaultStore } from "jotai";
import { formAnswersAtom } from "./atom";

export const getStepZodSchema = (step: Step) => {
  let schema: Record<string, z.ZodType<Answer, any, any>> = {};
  step.questions.forEach((question) => {
    switch (question.type) {
      case "boolean":
      case "terminatorButton":
        // always required for boolean but we have a default value
        schema[question.id] = z
          .boolean()
          .default(question.defaultAnswer)
        break;
      case "multiChoice":
      case "multiSelect":
        schema[question.id] = z
          .array(z.string())
          .default(question.defaultAnswer)
        break;
      case "text":
      case "textarea":
      case "select":
      case "body":
        schema[question.id] = z
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
        case "text":
        case "textarea":
          const answer = values[question.id] as string;
          if (isRequired && answer.length === 0)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Ajouter une valeur.',
              path: [question.id]
            });
          break;
        case "multiChoice":
        case "multiSelect":
          const multiAnswer = values[question.id] as string[];
          if (isRequired && multiAnswer.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Ajouter au moins une valeur.',
              path: [question.id]
            });
          }
          if (!multiAnswer.every((v) => question.options.some((option) => option.value === v)))
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Une valeur non valide a été ajoutée.',
              path: [question.id]
            });
          break;
        case "select":
          const selectAnswer = values[question.id] as string;
          if (isRequired && selectAnswer.length === 0)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Ajouter une valeur.',
              path: [question.id]
            });
          if (selectAnswer !== question.defaultAnswer && !question.options.some((option) => option.value === selectAnswer))
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Ajouter une valeur valide.',
              path: [question.id]
            });
          break;
        case "body":
          const bodyAnswer = values[question.id] as string;
          if (isRequired && bodyAnswer.length === 0)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Sélectionner une partie du corps.',
              path: [question.id]
            });
          break;
      }
    });
  });
  return fullSchema
};