import { MultiStepForm } from "./_components/multi-step-form";
import { Provider } from "jotai";
import { getSharedMetadata } from "@/config/shared-metadata";
import { siteConfig } from "@/config/site";
import { api } from "@/trpc/server";

const METADATA = {
  title: "Questionnaire",
  description: "Questionnaire de demande de soin non programmé",
  url: siteConfig.url + "/questionnaire",
};

export const metadata = {
  title: METADATA.title,
  description: METADATA.description,
  ...getSharedMetadata(METADATA.title, METADATA.description, METADATA.url),
};

export default async function Page() {
  const { form } = await api.questionnaire.getDefaultForm.query();
  if (!form) return <div>Formulaire non trouvé</div>;
  return (
    <div className="flex flex-col grow">
      <Provider>
        <MultiStepForm form={form} />
      </Provider>
    </div>
  );
}
