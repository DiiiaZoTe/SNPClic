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
import { MyPagination } from "@/components/utilities/pagination";
import { TitleWrapper } from "@/components/layout/(app)/title-wrapper";

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
      <TitleWrapper title="Toutes les soumissions">
        <div className="h-full flex flex-col justify-center items-center gap-8">
          Il n&apos;y a aucune soumissions.
        </div>
      </TitleWrapper>
    );
  }

  return (
    <TitleWrapper title="Toutes les soumissions">
      <SubmissionTable submissions={submissions} showEmail />
      <MyPagination total={count} page={page} pageSize={pageSize} />
    </TitleWrapper>
  );
}
