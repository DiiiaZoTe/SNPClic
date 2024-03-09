import MyLink from "@/components/utilities/link";
import Logout from "@/components/utilities/logout";
import { getSharedMetadata } from "@/config/shared-metadata";
import { siteConfig } from "@/config/site";

import { validateRequestSSR } from "@/server/auth/validate-request";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/auth/redirects";
import { TitleWrapper } from "@/components/layout/(app)/title-wrapper";

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

  return <TitleWrapper title="Dashboard"></TitleWrapper>;
}
