import { FORM_DATA } from "./content";
import { MultiStepForm } from "./_components/multiStepForm";
import { Provider } from "jotai";
import { getSharedMetadata } from "@/config/shared-metadata";
import { siteConfig } from "@/config/site";

const METADATA = {
  title: "Questionnaire",
  description: "Questionnaire de demande de soin non programmé",
  url: siteConfig.url+"/questionnaire",
}

export const metadata = {
  title: METADATA.title,
  description: METADATA.description,
  ...getSharedMetadata(METADATA.title, METADATA.description, METADATA.url),
};

export default function Page() {

  return (
    <div className="flex flex-col grow">
      <Provider>
        <MultiStepForm
          stepsData={FORM_DATA}
        />
      </Provider>
    </div>
  );
}
