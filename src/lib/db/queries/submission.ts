"use server"

import { db } from "@/server/db";

import { eq, and, desc, count } from "drizzle-orm";
import { MySqlSelect } from "drizzle-orm/mysql-core";
import { formSubmission } from "@/server/db/schema";


function withPagination<T extends MySqlSelect>(
  qb: T,
  page: number = 1,
  pageSize: number = 10,
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}

export const getAllSubmissionByUser = async ({
  userId,
  pagination = {
    page: 1,
    pageSize: 10,
  },
}: {
  userId: string;
  pagination?: { page?: number; pageSize?: number };
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
  return withPagination(query, pagination.page, pagination.pageSize);
}

export const getCountSubmissionByUser = async ({ userId }: { userId: string }) => {
  if (!userId) return [];
  return db
    .select({ value: count(formSubmission.uuid) })
    .from(formSubmission)
    .where(eq(formSubmission.submittedBy, userId));
}

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