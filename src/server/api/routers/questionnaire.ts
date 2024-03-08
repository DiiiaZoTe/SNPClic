import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { formSubmission, submissionAnswer, submissionAnswerStringArray } from "@/server/db/schema";
import { eq, inArray } from "drizzle-orm";
import { Form } from "@/app/(app)/(protected)/questionnaire/types";

import { FORM_DATA } from "@/app/(app)/(protected)/questionnaire/content";
import { generateUUID } from "@/lib/utilities/uuid";
import { TRPCError } from "@trpc/server";
import { logError } from "@/lib/utilities/logger";

import { PDFTemplate } from "@/lib/storage/pdfTemplate";
import { generatePDF } from "@/lib/storage/pdfHelpers";

import { r2 } from "@/server/storage/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { getSubmissionDetails } from "@/server/db/queries/submission";

export const questionnaireRouter = createTRPCRouter({
  getDefaultForm: protectedProcedure
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

  submitFormAndPDF: protectedProcedure
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
          submittedAt: new Date(),
          stopReason: input.stopReason?.reason == "" ? null : input.stopReason?.reason,
          stopReasonQuestionId: input.stopReason?.questionID,
          skippedSteps: input.skippedSteps,
        },
        answers: input.answers.map((answer) => ({
          questionId: answer.questionID,
          answerType: answer.answerType,
          booleanAnswer: answer.answerType === "boolean" ? answer.answer as boolean : null,
          stringAnswer: answer.answerType === "string" ? answer.answer as string : null,
          stringArrayAnswer: answer.answerType === "string_array" ? answer.answer as string[] : null,
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
        const [formSubmissionData] = await tx.insert(formSubmission).values({
          uuid: submissionUUID,
          formId: formID,
          submittedBy: ctx.user.id,
          stopReason: input.stopReason?.reason == "" ? null : input.stopReason?.reason,
          stopReasonQuestionId: input.stopReason?.questionID,
          skippedSteps: input.skippedSteps,
        });
        if (formSubmissionData.affectedRows == 0) rollback("form submission");
        const submissionID = formSubmissionData.insertId;

        // * insert the form answers. Can't be concurrent because tx does not support concurrent operations
        for (const answer of input.answers) {
          const [submissionAnswerData] = await tx.insert(submissionAnswer).values({
            submissionId: submissionID as any,
            questionId: answer.questionID,
            answerType: answer.answerType,
            booleanAnswer: answer.answerType === "boolean" ? answer.answer as boolean : null,
            stringAnswer: answer.answerType === "string" ? answer.answer as string : null,
            skipped: answer.skipped,
          });
          if (submissionAnswerData.affectedRows == 0) rollback("form answer");
          const answerID = submissionAnswerData.insertId;
          // * insert string array answers concurrently
          if (answer.answerType === "string_array" && Array.isArray(answer.answer)) {
            for (const value of answer.answer) {
              const [stringArrayData] = await tx.insert(submissionAnswerStringArray).values({
                answerId: answerID as any,
                value,
              });
              if (stringArrayData.affectedRows == 0) rollback("form answer string array");
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


  generatePDF: protectedProcedure
    .input(z.string().min(1)) // uuid
    .mutation(async ({ ctx, input }) => {
      const submissionUUID = input;

      const submission = await getSubmissionDetails({
        submissionId: submissionUUID,
        user: ctx.user,
      });

      if (submission.error !== undefined) {
        logError({ request: ctx.headers, error: "Error getting submission details", location: `/api/trpc/questionnaire.generatePDF`, otherData: { submissionUUID, error: submission.error } });
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error getting submission details" });
      }


      const pdfTemplateInput = {
        formData: submission.formData,
        submissionData: submission.submissionData,
        answers: submission.answers,
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