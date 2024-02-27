import { siteConfig } from "@/config/site";
import { getSharedMetadata } from "@/config/shared-metadata";

const METADATA = {
  title: "Politique de Confidentialité",
  description: "Politique de Confidentialité SNPClic",
  url: siteConfig.url + "/politique-confidentialite",
};

export const metadata = {
  title: METADATA.title,
  description: METADATA.description,
  ...getSharedMetadata(METADATA.title, METADATA.description, METADATA.url),
};

import Balancer from "react-wrap-balancer";
import { PRIVACY_CONTENT } from "./content";

export default function Page() {
  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight text-center">
        <Balancer>Politique de Confidentialité</Balancer>
      </h1>
      <div className="flex flex-col gap-8 max-w-xl">
        {PRIVACY_CONTENT.map(({ title, content }, index) => (
          <div key={title} className="flex flex-row gap-6">
            <div className="flex flex-col gap-4 items-center">
              <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {index + 1}.
              </p>
              <div className="flex-1 w-[1px] border-l border-l-border" />
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {title}
              </h2>
              <p className="text-foreground leading-7">
                <Balancer>{content}</Balancer>
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
