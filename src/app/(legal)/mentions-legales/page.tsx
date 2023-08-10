import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Balancer from "react-wrap-balancer";

const AUTHORS = [
  ["Directeur de publication", "Docteur Christophe Carrière"],
  ["Recherche", "Katarina Vencel"],
  ["Développement", "Alexander Vencel"],
];

const SITE_INFORMATION = [
  ["Nom du site", "SNPClic"],
  ["Lien du site", "https://snpclic.fr"],
  ["Hébergeur", "Cloudflare", "https://cloudflare.com"],
];

const LICENSE_INFORMATION = [
  ["Licence", "AGPL-3.0", "https://www.gnu.org/licenses/agpl-3.0.fr.html"],
  ["Code source", "GitHub", "#"],
];

export default function Page() {
  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight"><Balancer>Mentions légales</Balancer></h1>
      <div className="w-full grid lg:grid-cols-2 gap-4 sm:gap-8">
        <CustomCard title="Auteurs" content={AUTHORS} />
        <CustomCard title="Information du site" content={SITE_INFORMATION} />
        <CustomCard
          title="Information de licence"
          content={LICENSE_INFORMATION}
        />
        <CustomCard title="Licence">
          <div className="rounded bg-muted px-4 py-3 font-mono text-sm">
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
  content?: string[][];
  children?: React.ReactNode;
}) => {
  return (
    <Card className=" bg-background text-foreground">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {content?.map(([title, name, URL]) => (
          <div className="flex flex-col gap-2">
            <p className="font-semibold">{title}</p>
            {URL ? (
              <div className="flex flex-wrap gap-4 items-center">
                <a
                  href={URL}
                  className="text-primary underline underline-offset-4"
                >
                  {name}
                </a>
                <ExternalLink className="text-foreground/60 w-4 h-4" />
              </div>
            ) : (
              <p>{name}</p>
            )}
          </div>
        ))}
        {children}
      </CardContent>
    </Card>
  );
};
