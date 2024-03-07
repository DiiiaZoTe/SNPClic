"use server"

import { db } from "@/server/db";

import { eq, and, desc, count, inArray } from "drizzle-orm";
import { MySqlSelect } from "drizzle-orm/mysql-core";
import { formSubmission, submissionAnswer, submissionAnswerStringArray } from "@/server/db/schema";
import { FORM_DATA } from "@/app/(app)/(protected)/questionnaire/content";

function withPagination<T extends MySqlSelect>(
  qb: T,
  page: number = 1,
  pageSize: number = 10,
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}

/** getAll the submission by user, paginated limit 10 by default.
 *  @warning  if `noLimit` is true, return all the submissions without limit.
 */
export const getAllSubmissionByUser = async ({
  userId,
  pagination = {
    page: 1,
    pageSize: 10,
  },
  noLimit = false,
}: {
  userId: string;
  pagination?: { page?: number; pageSize?: number };
  noLimit?: boolean;
}) => {
  const query = db
    .select({
      uuid: formSubmission.uuid,
      formId: formSubmission.formId,
      submittedAt: formSubmission.submittedAt,
      stopReason: formSubmission.stopReason,
      stopReasonQuestionId: formSubmission.stopReasonQuestionId,
      skippedSteps: formSubmission.skippedSteps,
    })
    .from(formSubmission)
    .where(eq(formSubmission.submittedBy, userId))
    .orderBy(desc(formSubmission.submittedAt))
    .$dynamic();
  if (noLimit) return await query;
  return withPagination(query, pagination.page, pagination.pageSize);
}

/** get the number of submission from a user */
export const getCountSubmissionByUser = async ({ userId }: { userId: string }) => {
  if (!userId) return [];
  return db
    .select({ value: count(formSubmission.uuid) })
    .from(formSubmission)
    .where(eq(formSubmission.submittedBy, userId));
}

/** Delete a submission by a user */
export const deleteSubmissionById = async ({
  submissionId,
  userId,
}: {
  submissionId: string;
  userId: string;
}) => {
  // we don't delete the submission, we just remove the submittedBy
  return db
    .update(formSubmission)
    .set({
      submittedBy: null,
    }).where(and(eq(formSubmission.uuid, submissionId), eq(formSubmission.submittedBy, userId)));
  // return db
  //   .delete(formSubmission)
  //   .where(and(eq(formSubmission.uuid, submissionId), eq(formSubmission.submittedBy, userId)));
}

/** get the full submission details (form, submission, answers) */
export const getSubmissionDetails = async ({
  submissionId,
  userId,
}: {
  submissionId: string;
  userId: string;
}) => {
  // * get the submission, answers and the form (here just config but normally from db)
  const submissionData = await db
    .select().from(formSubmission)
    .where(and(eq(formSubmission.uuid, submissionId), eq(formSubmission.submittedBy, userId)));
  const submissionID = submissionData[0]?.id;
  const formID = submissionData[0]?.formId;
  if (!submissionID || !formID) return { error: "No form submission found" };

  //* get answers
  const answersData = await db
    .select().from(submissionAnswer)
    .where(eq(submissionAnswer.submissionId, submissionID));
  if (!answersData) return { error: "No answer found" };

  //* get string array answers
  const stringArrayAnswersID = answersData.filter((answer) => answer.answerType === "string_array").map((answer) => answer.id);
  let stringArrayAnswersData: {
    answerId: bigint,
    value: string
  }[] = [];

  if (stringArrayAnswersID.length) {
    stringArrayAnswersData = await db
      .select({
        answerId: submissionAnswerStringArray.answerId,
        value: submissionAnswerStringArray.value
      }).from(submissionAnswerStringArray)
      .where(inArray(submissionAnswerStringArray.answerId, stringArrayAnswersID));
  }

  //* get form
  // const formData = await ctx.db.select({ id: form.id }).from(form).where(eq(form.id, formID));
  const formData = FORM_DATA;
  if (!formData) return { error: "Unsuccessful form retrieval" };

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
}