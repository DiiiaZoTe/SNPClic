import { TitleWrapper } from "@/components/layout/(app)/title-wrapper";
import { getSharedMetadata } from "@/config/shared-metadata";
import { siteConfig } from "@/config/site";

const METADATA = {
  title: "Paramètres",
  description: "Paramètres de compte SNPClic",
  url: siteConfig.url + "/paremetres",
};

export const metadata = {
  title: METADATA.title,
  description: METADATA.description,
  ...getSharedMetadata(METADATA.title, METADATA.description, METADATA.url),
};

export default function Page() {
  return <TitleWrapper title="Paramètres"></TitleWrapper>;
}
