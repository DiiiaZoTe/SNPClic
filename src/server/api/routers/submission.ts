import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { logError } from "@/lib/utilities/logger";
import { deleteSubmissionById } from "@/lib/db/queries/submission";

import { formSubmission, submissionAnswer, submissionAnswerStringArray } from "@/server/db/schema";
import { inArray, eq, and } from "drizzle-orm";

import { FORM_DATA } from "@/app/(app)/(protected)/questionnaire/content";

export const submissionRouter = createTRPCRouter({
  deleteSubmissionById: protectedProcedure
    .input(z.object({
      submissionId: z.string().min(1, "Veuillez fournir un identifiant de soumission valide."),
    }))
    .mutation(async ({ ctx, input }) => {
      const { submissionId } = input;
      const { user } = ctx;
      try {
        await deleteSubmissionById({
          submissionId,
          userId: user.id,
        });
      } catch (error) {
        logError({
          location: "/api/trpc/submission.deleteSubmissionById",
          error: error
        })
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur s'est produite lors de la suppression de la soumission.",
          cause: submissionId
        });
      }
      return {
        success: true,
        submissionId
      };
    }),

  getSubmissionDetailById: protectedProcedure
    .input(z.object({
      submissionId: z.string().min(1, "Veuillez fournir un identifiant de soumission valide."),
    }))
    .query(async ({ ctx, input }) => {
      const { submissionId } = input;

      // * get the submission, answers and the form (here just config but normally from db)
      const submissionData = await ctx.db
        .select().from(formSubmission)
        .where(and(eq(formSubmission.uuid, submissionId), eq(formSubmission.submittedBy, ctx.user.id)));
      const submissionID = submissionData[0]?.id;
      const formID = submissionData[0]?.formId;
      if (!submissionID || !formID) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No form submission found" });

      //* get answers
      const answersData = await ctx.db
        .select().from(submissionAnswer)
        .where(eq(submissionAnswer.submissionId, submissionID));
      if (!answersData) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No answer found" });

      //* get string array answers
      const stringArrayAnswersID = answersData.filter((answer) => answer.answerType === "string_array").map((answer) => answer.id);
      let stringArrayAnswersData: {
        answerId: bigint,
        value: string
      }[] = [];

      console.log(stringArrayAnswersID)
      if (stringArrayAnswersID.length) {
        stringArrayAnswersData = await ctx.db
          .select({
            answerId: submissionAnswerStringArray.answerId,
            value: submissionAnswerStringArray.value
          }).from(submissionAnswerStringArray)
          .where(inArray(submissionAnswerStringArray.answerId, stringArrayAnswersID));
      }

      //* get form
      // const formData = await ctx.db.select({ id: form.id }).from(form).where(eq(form.id, formID));
      const formData = FORM_DATA;
      if (!formData) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unsuccessful form retrieval" });

      return {
        formData,
        submissionData: {
          uuid: submissionData[0]!.uuid,
          formId: formID.toString(),
          submittedAt: submissionData[0]!.submittedAt,
          stopReason: submissionData[0]?.stopReason,
          stopReasonQuestionId: submissionData[0]?.stopReasonQuestionId,
          skippedSteps: submissionData[0]!.skippedSteps,
        },
        answers: answersData.map((answer) => ({
          questionId: answer.questionId,
          answerType: answer.answerType,
          booleanAnswer: answer.booleanAnswer,
          stringAnswer: answer.stringAnswer,
          stringArrayAnswer: answer.answerType === "string_array" ? stringArrayAnswersData.filter((stringArrayAnswer) => stringArrayAnswer.answerId === answer.id).map((stringArrayAnswer) => stringArrayAnswer.value) : null,
          skipped: answer.skipped,
        }))
      }
    }),
});