import MyLink from "@/components/utilities/link";
import Logout from "@/components/utilities/logout";
import { getSharedMetadata } from "@/config/shared-metadata";
import { siteConfig } from "@/config/site";

import { validateRequestSSR } from "@/server/auth/validate-request";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/auth/redirects";

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

  return (
    <div>
      <h1>Dashboard</h1>
      <MyLink href="/questionnaire">questionnaire</MyLink>
      <Logout>
        <button>Logout</button>
      </Logout>
    </div>
  );
}
