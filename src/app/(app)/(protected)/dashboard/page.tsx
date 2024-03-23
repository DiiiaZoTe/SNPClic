import { getSharedMetadata } from "@/config/shared-metadata";
import { siteConfig } from "@/config/site";

import { validateRequestSSR } from "@/server/auth/validate-request";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/auth/redirects";
import { TitleWrapper } from "@/components/layout/(app)/title-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { cn } from "@/lib/utils";
import {
  getCountSubmission,
  getCountSubmissionByUser,
} from "@/server/db/queries/submission";
import MyLink from "@/components/utilities/link";
import { getCountUsers } from "@/server/db/queries/auth";

const METADATA = {
  title: "Dashboard",
  description: "Page de compte SNPClic",
  url: siteConfig.url + "/dashboard",
};

export const metadata = {
  title: METADATA.title,
  description: METADATA.description,
  ...getSharedMetadata(METADATA.title, METADATA.description, METADATA.url),
};

export default async function Page() {
  // validate request
  const { user } = await validateRequestSSR();
  if (!user) redirect(redirects.toNonProtected);

  const [mySubmissionCountRes, totalSubmissionCountRes, userCountRes] =
    await Promise.all([
      getCountSubmissionByUser({ userId: user.id }),
      getCountSubmission(),
      getCountUsers(),
    ]);
  const mySubmissionCount = mySubmissionCountRes[0]?.value ?? 0;
  const totalSubmissionCount = totalSubmissionCountRes[0]?.value ?? 0;
  const userCount = userCountRes[0]?.value ?? 0;

  return (
    <TitleWrapper title="Dashboard">
      <MyLink href="/soumissions" nextLink={false}>
        <CustomCard
          title="Mes soumissions"
          description="Nombre de soumissions envoyées:"
        >
          <p className="text-5xl font-semibold">{mySubmissionCount}</p>
        </CustomCard>
      </MyLink>
      {user.role === "admin" && (
        <>
          <MyLink href="/admin/soumissions" nextLink={false}>
            <CustomCard
              title="Soumissions"
              description="Nombre total de soumissions:"
            >
              <p className="text-5xl font-semibold">{totalSubmissionCount}</p>
            </CustomCard>
          </MyLink>
          <MyLink href="/admin/utilisateurs" nextLink={false}>
            <CustomCard
              title="Utilisateurs"
              description="Nombre total d'utilisateurs:"
            >
              <p className="text-5xl font-semibold">{userCount}</p>
            </CustomCard>
          </MyLink>
        </>
      )}
    </TitleWrapper>
  );
}

interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}
const CustomCard = React.forwardRef<HTMLDivElement, CustomCardProps>(
  ({ title, description, children, className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className="rounded-xl bg-background border border-muted shadow-none"
        {...props}
      >
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className={cn("flex flex-col gap-4", className)}>
          {children}
        </CardContent>
      </Card>
    );
  }
);

CustomCard.displayName = "Card";
