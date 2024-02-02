import { siteConfig } from "@/config/site";
import { getSharedMetadata } from "@/config/shared-metadata";

const METADATA = {
  title: "Mentions légales",
  description: "Mentions légales SNPClic",
  url: siteConfig.url + "/mentions-legales",
};

export const metadata = {
  title: METADATA.title,
  description: METADATA.description,
  ...getSharedMetadata(METADATA.title, METADATA.description, METADATA.url),
};

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Balancer from "react-wrap-balancer";
import { LEGAL_CONTENT } from "./content";
import type { LegalContentType } from "../type";

export default function Page() {
  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight text-center">
        <Balancer>Mentions légales</Balancer>
      </h1>
      <div className="w-full grid lg:grid-cols-2 gap-4 sm:gap-8">
        {LEGAL_CONTENT.map(({ title, content }) => (
          <CustomCard key={title} title={title} content={content} />
        ))}

        <CustomCard title="Licence">
          <div className="bg-muted px-4 py-3 font-mono text-sm">
            <p>
              This website and its associated source code are licensed under the
              GNU Affero General Public License version 3 (AGPL-3.0). This means
              that you are free to modify and distribute both the original and
              modified versions of the code, as long as you adhere to the terms
              of the AGPL-3.0. Under the AGPL-3.0, you must also provide access
              to the corresponding source code of the distributed work to all
              users who interact with it remotely through a computer network.
              Furthermore, all modified versions must also be licensed under the
              AGPL-3.0, with the same obligations to disclose source code. A
              full copy of the AGPL-3.0 license, detailing all terms and
              conditions, can be found at the following link:
              <br />
              <a
                href="#"
                className="font-medium text-primary underline underline-offset-4"
              >
                GNU Affero General Public License version 3
              </a>
            </p>
          </div>
        </CustomCard>
      </div>
    </>
  );
}

const CustomCard = ({
  title,
  description,
  content,
  children,
}: {
  title: string;
  description?: string;
  content?: LegalContentType;
  children?: React.ReactNode;
}) => {
  return (
    <Card className="rounded-xl bg-background border border-muted shadow-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {content?.map(({ subtitle, subcontent, url }) => (
          <div key={subtitle} className="flex flex-col gap-2">
            <p className="font-semibold">{subtitle}</p>
            {url ? (
              <div className="flex flex-wrap gap-4 items-center">
                <a
                  href={url}
                  className="text-primary underline underline-offset-4"
                >
                  {subcontent}
                </a>
                <ExternalLink className="text-foreground/60 w-4 h-4" />
              </div>
            ) : (
              <p>{subcontent}</p>
            )}
          </div>
        ))}
        {children}
      </CardContent>
    </Card>
  );
};
