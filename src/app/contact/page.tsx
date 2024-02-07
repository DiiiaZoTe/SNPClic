import { siteConfig } from "@/config/site";
import { getSharedMetadata } from "@/config/shared-metadata";

const METADATA = {
  title: "Contact",
  description: "Page de contact SNPClic",
  url: siteConfig.url + "/contact",
};

export const metadata = {
  title: METADATA.title,
  description: METADATA.description,
  ...getSharedMetadata(METADATA.title, METADATA.description, METADATA.url),
};

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Balancer from "react-wrap-balancer";

import { CONTACT_CONTENT, type SubContentType } from "./content";
import MyLink from "@/components/utilities/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-10 w-full items-center">
      <h1 className="text-4xl font-bold tracking-tight">
        <Balancer>Contact</Balancer>
      </h1>
      <div className="max-w-xl flex flex-col gap-4 sm:gap-8">
        {CONTACT_CONTENT.map((content) => (
          <CustomCard
            key={content.name}
            name={content.name}
            role={content.role}
            content={content.content}
          />
        ))}
      </div>
    </div>
  );
}

const CustomCard = ({
  name,
  role,
  content,
}: {
  name: string;
  role: string;
  content: SubContentType;
}) => {
  return (
    <Card className="bg-background rounded-xl border border-muted shadow-none">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{role}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {content.map((subContent) =>
          typeof subContent === "string" ? (
            <p key={subContent}>{subContent}</p>
          ) : (
            <MyLink
              href={subContent.url}
              key={subContent.value}
              className="text-primary underline underline-offset-2 w-fit"
            >
              {subContent.value}
            </MyLink>
          )
        )}
      </CardContent>
    </Card>
  );
};
