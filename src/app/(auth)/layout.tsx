import { headers } from "next/headers";
import { BackButton } from "./back-button";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/logos/logo";

export default function Layout({ children }: { children: React.ReactNode }) {
  // check if referer is from the same domain
  const referer = headers().get("referer") || "";
  console.log(referer);
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
        {children}
      </div>

      <div className="hidden w-full col-span-2 lg:flex h-full max-h-screen items-center sticky top-0">
        <div className="w-full h-full relative flex justify-center items-center overflow-clip">
          <span className="z-10 absolute h-full w-[1.5px] left-1/2 top-0 -translate-x-[calc(50%-4px)] bg-gradient-to-b from-background via-foreground to-background" />
          <div className="z-20 bg-background w-40 h-40 rounded-full flex justify-center items-center">
            <Logo className="w-32 h-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
