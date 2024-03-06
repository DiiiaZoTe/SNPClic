import { unstable_noStore as noStore } from "next/cache";

import { siteConfig } from "@/config/site";
import { getSharedMetadata } from "@/config/shared-metadata";
import { api } from "@/trpc/server";
import { Suspense } from "react";
import { SubmissionRecap } from "./recap";
import { DownloadButton } from "@/components/utilities/downloadButton";
import { Download, Loader2 } from "lucide-react";
import { Loading } from "@/components/utilities/loading";
import { DeleteButton } from "./delete";

const METADATA = {
  title: "Soumissions",
  description: "Vos soumissions de questionnaires SNPClic",
  url: siteConfig.url + "/questionnaire",
};

export const metadata = {
  title: METADATA.title,
  description: METADATA.description,
  ...getSharedMetadata(METADATA.title, METADATA.description, METADATA.url),
};

export default async function Page({
  params,
}: {
  params: {
    submissionId: string;
  };
}) {
  noStore();

  return (
    <div className="container h-full flex flex-col gap-8 my-8 max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold">{params.submissionId}</h1>
      <Suspense fallback={<LoadingScreen />}>
        <Submission submissionId={params.submissionId} />
      </Suspense>
    </div>
  );
}

const Submission = async ({ submissionId }: { submissionId: string }) => {
  const submission = await api.submission.getSubmissionDetailById.query({
    submissionId: submissionId,
  });

  const date = new Date(submission.submissionData.submittedAt);
  const formattedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  const formattedTime = `${date.getHours()}h${date.getMinutes()}`;

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold leading-none tracking-tight">
          Informations générales:
        </h2>
        <p>
          Soumis le {formattedDate} à {formattedTime}
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
