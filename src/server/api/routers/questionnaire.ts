import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { form_submission, submission_answer, submission_answer_string_array } from "@/server/db/schema";
import { eq, inArray } from "drizzle-orm";
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
      skippedSteps: z.array(z.number()),
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

      const submissionUUID = generateUUID();

      const pdfTemplateInput = {
        formData: FORM_DATA,
        submissionData: {
          uuid: submissionUUID,
          submitted_at: new Date(),
          stop_reason: input.stopReason?.reason == "" ? null : input.stopReason?.reason,
          stop_reason_question_id: input.stopReason?.questionID,
          skipped_steps: input.skippedSteps,
        },
        answers: input.answers.map((answer) => ({
          question_id: answer.questionID,
          answer_type: answer.answerType,
          boolean_answer: answer.answerType === "boolean" ? answer.answer as boolean : null,
          string_answer: answer.answerType === "string" ? answer.answer as string : null,
          string_array_answer: answer.answerType === "string_array" ? answer.answer as string[] : null,
          skipped: answer.skipped,
        }))
      };
      // * start pdf generation
      const pdfPromise = generatePDF(PDFTemplate(pdfTemplateInput));

      // * start form submission
      const insertPromise = ctx.db.transaction(async (tx) => {
        const rollback = (where: string) => {
          try {
            tx.rollback();
          } catch (e) {
            logError({ request: ctx.headers, error: `Error inserting ${where}`, location: `/api/trpc/questionnaire.submitForm`, otherData: { input } });
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Error inserting ${where}`, cause: "Save" });
          }
        }

        // * change this to get the entire form later from the db and put it outside the transaction above the pdf generation
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
          skipped_steps: input.skippedSteps,
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
        return true;
      });

      // * await pdf generation and form submission
      const [pdf, successInsert] = await Promise.all([pdfPromise, insertPromise]);

      if (!successInsert) {
        logError({ request: ctx.headers, error: "Unsuccessful form submission", location: `/api/trpc/questionnaire.submitForm`, otherData: { input } });
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unsuccessful form submission", cause: "Save" });
      }
      if (!pdf || pdf.length === 0) {
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

      return { successInsert: true, submissionID: submissionUUID, successPDF: true };
    }),


  generatePDF: publicProcedure
    .input(z.string().min(1)) // uuid
    .mutation(async ({ ctx, input }) => {
      const submissionUUID = input;

      // * get the submission, answers and the form (here just config but normally from db)
      const submissionData = await ctx.db.select().from(form_submission).where(eq(form_submission.uuid, submissionUUID));
      const submissionID = submissionData[0]?.id;
      const formID = submissionData[0]?.form_id;
      if (!submissionID || !formID) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No form submission found" });
      const answersData = await ctx.db
        .select().from(submission_answer)
        .where(eq(submission_answer.submission_id, submissionID));
      if (!answersData) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No answer found" });
      const stringArrayAnswersID = answersData.filter((answer) => answer.answer_type === "string_array").map((answer) => answer.id);
      let stringArrayAnswersData: {
        answer_id: bigint,
        value: string
      }[] = [];
      if (stringArrayAnswersID.length) {
        stringArrayAnswersData = await ctx.db
          .select({
            answer_id: submission_answer_string_array.answer_id,
            value: submission_answer_string_array.value
          }).from(submission_answer_string_array)
          .where(inArray(submission_answer_string_array.answer_id, stringArrayAnswersID));
        if (!stringArrayAnswersData.length) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Should have retrieved string array answer" })
      }
      // const formData = await ctx.db.select({ id: form.id }).from(form).where(eq(form.id, formID));
      const formData = FORM_DATA;
      if (!formData) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unsuccessful form retrieval" });

      const pdfTemplateInput = {
        formData,
        submissionData: {
          uuid: submissionUUID,
          submitted_at: submissionData[0]!.submitted_at,
          stop_reason: submissionData[0]?.stop_reason,
          stop_reason_question_id: submissionData[0]?.stop_reason_question_id,
          skipped_steps: submissionData[0]!.skipped_steps,
        },
        answers: answersData.map((answer) => ({
          question_id: answer.question_id,
          answer_type: answer.answer_type,
          boolean_answer: answer.boolean_answer,
          string_answer: answer.string_answer,
          string_array_answer: answer.answer_type === "string_array" ? stringArrayAnswersData.filter((stringArrayAnswer) => stringArrayAnswer.answer_id === answer.id).map((stringArrayAnswer) => stringArrayAnswer.value) : null,
          skipped: answer.skipped,
        }))
      };
      // * generate the pdf
      const pdf = await generatePDF(PDFTemplate(pdfTemplateInput));
      if (!pdf || pdf.length === 0) {
        logError({ request: ctx.headers, error: "Error generating pdf", location: `/api/trpc/questionnaire.generatePDF`, otherData: { submissionUUID } });
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error generating pdf" });
      }

      //* upload to R2
      try {
        await r2.send(new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: `${submissionUUID}.pdf`,
          Body: pdf,
          ContentType: 'application/pdf'
        }));
      } catch (err: any) {
        logError({ request: ctx.headers, error: "Error uploading pdf", location: `/api/trpc/questionnaire.generatePDF`, otherData: { submissionUUID } });
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error uploading pdf" });
      }

      return { success: true, filename: submissionUUID };
    })
});