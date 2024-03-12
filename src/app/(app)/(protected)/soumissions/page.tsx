import { unstable_noStore as noStore } from "next/cache";

import {
  getAllSubmissionByUser,
  getCountSubmissionByUser,
} from "@/server/db/queries/submission";
import { validateRequestSSR } from "@/server/auth/validate-request";

import { siteConfig } from "@/config/site";
import { getSharedMetadata } from "@/config/shared-metadata";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/auth/redirects";

import { SubmissionTable } from "@/app/(app)/(protected)/soumissions/table";
import { MyPagination } from "@/components/utilities/pagination";
import { Button } from "@/components/ui/button";
import MyLink from "@/components/utilities/link";
import { Plus } from "lucide-react";
import { TitleWrapper } from "@/components/layout/(app)/title-wrapper";

const METADATA = {
  title: "Soumissions",
  description: "Vos soumissions de questionnaires SNPClic",
  url: siteConfig.url + "/soumissions",
};

export const metadata = {
  title: METADATA.title,
  description: METADATA.description,
  ...getSharedMetadata(METADATA.title, METADATA.description, METADATA.url),
};

export const dynamic = "force-dynamic";

export type Submission = ReturnType<
  typeof getAllSubmissionByUser
> extends Promise<(infer R)[]>
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
    getAllSubmissionByUser({
      userId: user.id,
      pagination: {
        page: page,
        pageSize: pageSize,
      },
    }),
    getCountSubmissionByUser({ userId: user.id }),
  ]);

  const count = submissionCount[0]?.value ?? 0;

  if (!submissions.length) {
    return (
      <TitleWrapper title="Soumissions">
        <div className="h-full flex flex-col justify-center items-center gap-8">
          Vous n&apos;avez aucune soumissions.
          <Button variant="black" asChild>
            <MyLink href="/questionnaire">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une soumission
            </MyLink>
          </Button>
        </div>
      </TitleWrapper>
    );
  }

  return (
    <TitleWrapper title="Soumissions">
      <SubmissionTable submissions={submissions} />
      <MyPagination total={count} page={page} pageSize={pageSize} />
    </TitleWrapper>
  );
}
