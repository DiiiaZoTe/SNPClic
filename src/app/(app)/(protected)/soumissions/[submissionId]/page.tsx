import { unstable_noStore as noStore } from "next/cache";

import { siteConfig } from "@/config/site";
import { getSharedMetadata } from "@/config/shared-metadata";
import { type Metadata } from "next";

import { SubmissionRecap } from "./recap";
import { DownloadButton } from "@/components/utilities/downloadButton";
import { Download, Loader2 } from "lucide-react";
import { Loading } from "@/components/utilities/loading";
import { DeleteButton } from "./delete";
import { formatDate } from "@/lib/utilities/format-date";

import { validateRequestSSR } from "@/server/auth/validate-request";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/auth/redirects";

import { getSubmissionDetails } from "@/server/db/queries/submission";
import { Suspense } from "react";
import { User } from "lucia";
import { TitleWrapper } from "@/components/layout/(app)/title-wrapper";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { submissionId } = params;
  const metadata = {
    title: `Soumission Détail`,
    description: `Détails de la soumission ${submissionId} SNPclic`,
    url: `${siteConfig.url}/soumissions/${submissionId}`,
  };
  return {
    title: metadata.title,
    description: metadata.description,
    ...getSharedMetadata(metadata.title, metadata.description, metadata.url),
  };
}

export const dynamic = "force-dynamic";

type Props = {
  params: {
    submissionId: string;
  };
};

export default async function Page({ params }: Props) {
  noStore();
  // validate request
  const { user } = await validateRequestSSR();
  if (!user) redirect(redirects.toNonProtected);

  return (
    <TitleWrapper title={params.submissionId}>
      <Suspense fallback={<LoadingScreen />}>
        <Submission submissionId={params.submissionId} user={user} />
      </Suspense>
    </TitleWrapper>
  );
}

const Submission = async ({
  submissionId,
  user,
}: {
  submissionId: string;
  user: User;
}) => {
  const submission = await getSubmissionDetails({ submissionId, user });

  if (submission.error !== undefined) {
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center gap-2">
        <p>Une erreur est survenue...</p>
        <p>{submission.error}</p>
      </div>
    );
  }

  const date = new Date(submission.submissionData.submittedAt);
  const { formattedDate, formattedTime } = formatDate(date);
  return (
    <div className="flex flex-col gap-8 max-w-3xl w-full mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold leading-none tracking-tight">
          Informations générales:
        </h2>
        <p>
          Soumis le {formattedDate} à {formattedTime} (GMT+1 Paris)
        </p>
        <div className="flex flex-col xs:flex-row justify-between gap-2">
          <DownloadButton
            filename={submissionId}
            className="text-center w-fit min-w-36"
            loader={<Loader2 className="w-4 h-4 animate-spin" />}
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </DownloadButton>
          <DeleteButton submissionId={submissionId} />
        </div>
      </div>
      <SubmissionRecap submission={submission} />
    </div>
  );
};

const LoadingScreen = () => {
  return (
    <div className="h-full flex-1 flex flex-col items-center justify-center gap-4">
      <Loading className="w-8 h-8" />
      <p>Récupération des données...</p>
    </div>
  );
};
