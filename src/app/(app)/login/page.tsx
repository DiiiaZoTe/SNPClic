import { headers } from "next/headers";
import { BackButton } from "./back-button";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/logos/logo";
import { ContentWrapper } from "./content-wrapper";
import { LoginForm } from "./form";
import { getSharedMetadata } from "@/config/shared-metadata";
import { validateRequest } from "@/server/auth/validate-request";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/auth/redirects";
import { ThemeToggle } from "@/components/theme-toggle";

const METADATA = {
  title: "Login",
  description: "Page de connexion SNPClic",
  url: siteConfig.url + "/login",
};

export const metadata = {
  title: METADATA.title,
  description: METADATA.description,
  ...getSharedMetadata(METADATA.title, METADATA.description, METADATA.url),
};

export default async function Page() {
  const { user } = await validateRequest();
  if (user) redirect(redirects.toProtected);

  // check if referer is from the same domain
  const referer = headers().get("referer") || "";
  const backLink =
    referer.startsWith(siteConfig.url + "/login") ||
    referer.startsWith(siteConfig.url + "/signup")
      ? "/"
      : referer.startsWith(siteConfig.url)
      ? referer
      : "/";

  return (
    <div className="flex-1 w-full grid grid-cols-5 relative">
      <div className="relative w-full flex flex-col col-span-5 lg:col-span-3 p-4 sm:p-8">
        <BackButton backLink={backLink} />
        <ContentWrapper
          text={{
            title: "Bienvenue!",
            description: "Connectez-vous pour accéder à votre compte.",
          }}
        >
          <LoginForm />
        </ContentWrapper>
        <ThemeToggle triggerClassName="absolute bottom-4 left-4" buttonVariant="linkForeground" align="start"/>
      </div>

      <div className="hidden w-full col-span-2 lg:flex h-full max-h-screen items-center sticky top-0">
        <div className="w-full h-full relative flex justify-center items-center overflow-clip">
          <span className="z-10 absolute h-full rounded-full w-[1.5px] left-1/2 top-0 -translate-x-[calc(50%-4px)] bg-gradient-to-b from-background via-foreground to-background" />
          <div className="z-20 bg-background w-40 h-40 rounded-full flex justify-center items-center">
            <Logo className="w-32 h-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
