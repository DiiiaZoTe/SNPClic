import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { form_submission, submission_answer, submission_answer_string_array } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { Form } from "@/app/questionnaire/types";

import { FORM_DATA } from "@/app/questionnaire/content";
import { generateUUID } from "@/lib/uuid";
import { TRPCError } from "@trpc/server";
import { logError } from "@/lib/logger";

import { PDFTemplate } from "@/components/utilities/pdfTemplate";
import { generatePDF } from "@/lib/pdfHelpers";

import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

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

  submitFormAndPDF: publicProcedure
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
        if (input.error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error test", cause: "Test" });
        return { successInsert: true, successPDF: false, submissionID: generateUUID() };
      }

      const time1 = performance.now();

      const submissionUUID = generateUUID();

      // * start pdf generation
      const pdfPromise = generatePDF(PDFTemplate());

      // * start form submission
      const insertPromise = ctx.db.transaction(async (tx) => {
        const timeInsert1 = performance.now();

        const rollback = (where: string) => {
          try {
            tx.rollback();
          } catch (e) {
            logError({ request: ctx.headers, error: `Error inserting ${where}`, location: `/api/trpc/questionnaire.submitForm`, otherData: { input } });
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Error inserting ${where}`, cause: "Save" });
          }
        }

        // get the form id from the uuid
        // const selectFormId = await tx.select({ id: form.id }).from(form).where(eq(form.uuid, input.formID));
        // const formID = selectFormId[0]?.id;
        // if (!formID) rollback(" - no form found");
        const formID = BigInt(1);

        // * insert the form submission
        const formSubmissionData = await tx.insert(form_submission).values({
          uuid: submissionUUID,
          form_id: formID,
          stop_reason: input.stopReason?.reason == "" ? null : input.stopReason?.reason,
          stop_reason_question_id: input.stopReason?.questionID,
        });
        const submissionID = formSubmissionData.insertId;
        if (!submissionID) rollback("form submission");

        // * insert the form answers. Can't be concurrent because tx does not support concurrent operations
        for (const answer of input.answers) {
          const submissionAnswerData = await tx.insert(submission_answer).values({
            submission_id: submissionID as any,
            question_id: answer.questionID,
            answer_type: answer.answerType,
            boolean_answer: answer.answerType === "boolean" ? answer.answer as boolean : null,
            string_answer: answer.answerType === "string" ? answer.answer as string : null,
            skipped: answer.skipped,
          });
          // * insert string array answers concurrently
          if (answer.answerType === "string_array" && Array.isArray(answer.answer)) {
            const answerID = submissionAnswerData.insertId;
            if (!answerID) rollback("form answer");
            for (const value of answer.answer) {
              const stringArrayData = await tx.insert(submission_answer_string_array).values({
                answer_id: answerID as any,
                value,
              });
              if (!stringArrayData.insertId) rollback("form answer string array");
            };
          }
        }
        const timeInsert2 = performance.now();
        console.log(`Time to insert: ${timeInsert2 - timeInsert1}ms`);
        return true;
      });

      // * await pdf generation and form submission
      const [pdf, successInsert] = await Promise.all([pdfPromise, insertPromise]);
      const time2 = performance.now();
      console.log(`Time to generate pdf + insert: ${time2 - time1}ms`);

      if (!successInsert) {
        logError({ request: ctx.headers, error: "Unsuccessful form submission", location: `/api/trpc/questionnaire.submitForm`, otherData: { input } });
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unsuccessful form submission", cause: "Save" });
      }
      if (!pdf) {
        logError({ request: ctx.headers, error: `Unsuccessful PDF generation - ${submissionUUID}`, location: `/api/trpc/questionnaire.submitForm`, otherData: { input } });
        return { successInsert: true, successPDF: false, submissionID: submissionUUID };
      }

      //* upload to R2 like this
      try {
        await r2.send(new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: `${submissionUUID}.pdf`,
          Body: pdf,
          ContentType: 'application/pdf'
        }));
      } catch (err: any) {
        logError({ request: ctx.headers, error: `Unsuccessful PDF upload - ${submissionUUID}`, location: `/api/trpc/questionnaire.submitForm`, otherData: { input } });
        return { successInsert: true, successPDF: false, submissionID: submissionUUID };
      }

      const time3 = performance.now();
      console.log(`Time to finish: ${time3 - time1}ms`);
      return { successInsert: true, submissionID: submissionUUID, successPDF: true };
    }),


  generatePDF: publicProcedure
    .input(z.string().min(1)) // uuid
    .mutation(async ({ ctx, input }) => {
      const submissionUUID = input;

      const time1 = performance.now();

      // // * get the submission, answers and the form (here just config but normally from db)
      // const submissionData = await ctx.db.select().from(form_submission).where(eq(form_submission.uuid, submissionUUID));
      // const submissionID = submissionData[0]?.id;
      // const formID = submissionData[0]?.form_id;
      // if (!submissionID || !formID) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No form submission found" });
      // const answersData = await ctx.db
      //   .select().from(submission_answer)
      //   .leftJoin(submission_answer_string_array, eq(submission_answer.id, submission_answer_string_array.answer_id))
      //   .where(eq(submission_answer.submission_id, submissionID));
      // if (!answersData) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No answer found" });
      // // const formData = await ctx.db.select({ id: form.id }).from(form).where(eq(form.id, formID));
      // const formData = FORM_DATA;
      // if (!formData) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unsuccessful form retrieval" });

      // * generate the pdf
      const pdf = await generatePDF(PDFTemplate());

      try {
        //* upload to R2 like this
        await r2.send(new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: `${submissionUUID}.pdf`,
          Body: pdf,
          ContentType: 'application/pdf'
        }));
      } catch (err: any) {
        logError({ request: ctx.headers, error: "Error generating pdf", location: `/api/trpc/questionnaire.generatePDF`, otherData: { submissionUUID } });
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error generating pdf" });
      }

      const time2 = performance.now();
      console.log(`Time to generate and upload pdf: ${time2 - time1}ms`);

      return { success: true, filename: submissionUUID };
    })
});