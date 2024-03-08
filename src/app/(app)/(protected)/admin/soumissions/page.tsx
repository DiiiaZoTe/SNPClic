import { unstable_noStore as noStore } from "next/cache";

import {
  getAllSubmission,
  getCountSubmission,
} from "@/server/db/queries/submission";
import { validateRequestSSR } from "@/server/auth/validate-request";

import { siteConfig } from "@/config/site";
import { getSharedMetadata } from "@/config/shared-metadata";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/auth/redirects";

import { SubmissionTable } from "@/app/(app)/(protected)/soumissions/table";
import { SubmissionPagination } from "@/app/(app)/(protected)/soumissions/pagination";

const METADATA = {
  title: "Admin - Soumissions",
  description: "Toutesl les soumissions de questionnaires SNPClic",
  url: siteConfig.url + "/admin/soumissions",
};

export const metadata = {
  title: METADATA.title,
  description: METADATA.description,
  ...getSharedMetadata(METADATA.title, METADATA.description, METADATA.url),
};

export const dynamic = "force-dynamic";

export type Submission = ReturnType<typeof getAllSubmission> extends Promise<
  (infer R)[]
>
  ? R
  : never;

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
    pageSize?: string;
  };
}) {
  noStore();

  // validate request
  const { user } = await validateRequestSSR();
  if (!user) redirect(redirects.toNonProtected);

  const { page: pageStr = "1", pageSize: pageSizeStr = "10" } = searchParams;
  const page = parseInt(pageStr);
  const pageSize = parseInt(pageSizeStr);

  // get data
  const [submissions, submissionCount] = await Promise.all([
    getAllSubmission({
      pagination: {
        page: page,
        pageSize: pageSize,
      },
    }),
    getCountSubmission(),
  ]);

  const count = submissionCount[0]?.value ?? 0;

  if (!submissions.length) {
    return (
      <div className="h-full flex flex-col justify-center items-center gap-8">
        Il n&apos;y a aucune soumissions.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Soumissions</h1>
      <SubmissionTable submissions={submissions} />
      <SubmissionPagination total={count} page={page} pageSize={pageSize} />
    </div>
  );
}
