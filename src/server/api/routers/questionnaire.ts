import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { form, form_submission, submission_answer, submission_answer_string_array } from "@/server/db/schema";
import { sql } from "drizzle-orm";
import { Form } from "@/app/questionnaire/types";

import { FORM_DATA } from "@/app/questionnaire/content";
import { env } from "@/env";
import { generateUUID } from "@/lib/uuid";
import { TRPCError } from "@trpc/server";

export const questionnaireRouter = createTRPCRouter({
  getDefaultForm: publicProcedure
    .query(async () => {
      return {
        form: FORM_DATA as Form,
      };
      // * this is how we would query the db to get a form
      // const result = await ctx.db.select({
      //   config: form.config,
      //   id: form.uuid,
      //   name: form.name,
      // }).from(form).where(sql`${form.id} = 1`);
      // if (!result[0]?.config || !result[0].id) throw new Error("No form found");
      // return {
      //   form: result[0] as Form,
      // };
    }),
  submitForm: publicProcedure
    .input(z.object({
      formID: z.string().min(1), // uuid
      stopReason: z.union([
        z.object({
          reason: z.string(),
          questionID: z.string().optional(),
        }),
        z.undefined(),
      ]),
      answers: z.array(z.object({
        questionID: z.string().min(1),
        answerType: z.enum(["boolean", "string", "string_array"]),
        answer: z.union([
          z.string(),
          z.array(z.string()),
          z.boolean(),
          z.undefined(),
        ]),
        skipped: z.boolean().nullable(),
      }).refine((answer) => {
        switch (answer.answerType) {
          case "boolean":
            return typeof answer.answer === "boolean" && answer.answer !== undefined;
          case "string":
            return typeof answer.answer === "string" && answer.answer !== undefined;
          case "string_array":
            return Array.isArray(answer.answer) && answer.answer !== undefined;
          default:
            return false;
        }
      })),
      fake: z.boolean().optional(),
      error: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.fake) {
        // wait 1 second to simulate a slow request
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (input.error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error submitting form" });
        return { success: true };
      }

      // create a transaction to insert the form submission and its answers
      try {
        const submissionUUID = generateUUID();
        const success = await ctx.db.transaction(async (tx) => {
          try {
            // get the form id from the uuid
            // const selectFormId = await tx.select({id: form.id}).from(form).where(sql`${form.uuid} = ${input.formID}`);
            // const formID = selectFormId[0]?.id;
            // if (!formID) throw new Error("No form found");
            const formID = BigInt(1);

            // insert the form submission
            const formSubmissionResult = await tx.insert(form_submission).values({
              uuid: submissionUUID,
              form_id: formID,
              stop_reason: input.stopReason?.reason,
              stop_reason_question_id: input.stopReason?.questionID,
            });
            const submissionID = formSubmissionResult.insertId;
            if (!submissionID) throw new Error("Error inserting form submission");

            // insert the form answers. Can't be concurrent because tx does not support concurrent operations
            for (const answer of input.answers) {
              const insertFormAnswer = await tx.insert(submission_answer).values({
                submission_id: submissionID as any,
                question_id: answer.questionID,
                answer_type: answer.answerType,
                boolean_answer: answer.answerType === "boolean" ? answer.answer as boolean : null,
                string_answer: answer.answerType === "string" ? answer.answer as string : null,
                skipped: answer.skipped,
              });
              // insert string array answers concurrently
              if (answer.answerType === "string_array" && Array.isArray(answer.answer)) {
                const answerID = insertFormAnswer.insertId;
                if (!answerID) throw new Error("Error inserting form answer");
                for (const value of answer.answer) {
                  const stringArray = await tx.insert(submission_answer_string_array).values({
                    answer_id: answerID as any,
                    value,
                  });
                  if (!stringArray.insertId) throw new Error("Error inserting form answer string array");
                };
              }
            }
            return true;
          } catch (e) {
            tx.rollback();
            return false;
          }
        });
        if (!success) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error submitting form" });
        return { success: true, submissionID: submissionUUID };
      } catch (e) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error submitting form" });
      }
    }),
});
