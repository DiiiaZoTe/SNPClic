"use server"

import { db } from "@/server/db";

import { eq, and, desc, count, inArray } from "drizzle-orm";
import { MySqlSelect } from "drizzle-orm/mysql-core";
import { formSubmission, submissionAnswer, submissionAnswerStringArray } from "@/server/db/schema";
import { FORM_DATA } from "@/app/(app)/(protected)/questionnaire/content";
import type { User } from "lucia";
import { logError } from "@/lib/utilities/logger";
import { error } from "console";

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
export const getAllSubmission = async ({
  pagination = {
    page: 1,
    pageSize: 10,
  },
  noLimit = false,
}: {
  pagination?: { page?: number; pageSize?: number };
  noLimit?: boolean;
}) => {
  try {
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
      .orderBy(desc(formSubmission.submittedAt))
      .$dynamic();
    if (noLimit) return await query;
    return withPagination(query, pagination.page, pagination.pageSize);
  } catch (e) {
    logError({
      error: "Error getting all submission",
      location: "getAllSubmission",
      otherData: { e },
    })
    return [];
  }
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
  try {
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
  catch (e) {
    logError({
      error: "Error getting submission by user",
      location: "getAllSubmissionByUser",
      otherData: { e },
    })
    return [];
  }
}

/** get the number of submission from a user */
export const getCountSubmission = async () => {
  try {
    return db
      .select({ value: count(formSubmission.uuid) })
      .from(formSubmission)
  } catch (e) {
    logError({
      error: "Error getting submission count",
      location: "getCountSubmission",
      otherData: { e },
    })
    return [];
  }
}

/** get the number of submission from a user */
export const getCountSubmissionByUser = async ({ userId }: { userId: string }) => {
  try {
    if (!userId) return [];
    return db
      .select({ value: count(formSubmission.uuid) })
      .from(formSubmission)
      .where(eq(formSubmission.submittedBy, userId));
  } catch (e) {
    logError({
      error: "Error getting submission count by user",
      location: "getCountSubmissionByUser",
      otherData: { e },
    })
    return [];
  }
}

/** Delete a submission by a user */
export const deleteSubmissionById = async ({
  submissionId,
  user,
}: {
  submissionId: string;
  user: User;
}) => {
  try {

    if (!submissionId || !user.id) return;
    // we don't delete the submission, we just remove the submittedBy
    return db
      .update(formSubmission)
      .set({
        submittedBy: null,
      }).where(and(eq(formSubmission.uuid, submissionId), eq(formSubmission.submittedBy, user.id)));
    // return db
    //   .delete(formSubmission)
    //   .where(and(eq(formSubmission.uuid, submissionId), eq(formSubmission.submittedBy, userId)));
  } catch (e) {
    logError({
      error: "Error deleting submission",
      location: "deleteSubmissionById",
      otherData: { e },
    })
  }
  return undefined;
}

/** get the full submission details (form, submission, answers) */
export const getSubmissionDetails = async ({
  submissionId,
  user,
  onlySubmitterOrAdmin = true
}: {
  submissionId: string,
  user: User,
  onlySubmitterOrAdmin?: boolean,
}) => {
  const error = (e: string) => ({ error: e, formData: undefined, submissionData: undefined, answers: undefined });
  try {
    if (!submissionId || !user.id) return error("Aucune soumission trouvée.");
    const userId = user.id;
    // * get the submission, answers and the form (here just config but normally from db)
    const submissionData = await db
      .select().from(formSubmission)
      .where(eq(formSubmission.uuid, submissionId));
    const submissionID = submissionData[0]?.id;
    const formID = submissionData[0]?.formId;
    if (!submissionID || !formID) return error("Aucune soumission trouvée.");
    if ( // only submitter or admin can see the submission ?
      onlySubmitterOrAdmin && (
        submissionData[0]?.submittedBy !== userId &&
        user.role !== "admin"
      )
    ) return error("Vous n'êtes pas autorisé à voir cette soumission si elle existe.");

    //* get answers
    const answersData = await db
      .select().from(submissionAnswer)
      .where(eq(submissionAnswer.submissionId, submissionID));
    if (!answersData) return error("Erreur lors de la récupération des réponses. Veuillez réessayer plus tard.");

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
    if (!formData) return error("Erreur lors de la récupération du formulaire. Veuillez réessayer plus tard.");

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
      })),
      error: undefined,
    }
  } catch (e) {
    logError({
      error: "Error getting submission details",
      location: "getSubmissionDetails",
      otherData: { e },
    })
  }
  return error("Une erreur inconnue est survenue, nous avons été notifiés. Veuillez réessayer plus tard.");
}