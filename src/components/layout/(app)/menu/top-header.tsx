import { validateRequestSSR } from "@/server/auth/validate-request";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/auth/redirects";

import { Logo } from "@/components/logos/logo";
import { LogoText } from "@/components/logos/logo-text";
import { HeaderMenu } from "@/components/layout/(app)/menu/header-menu";
import { NavSectionProps } from "@/components/layout/(app)/menu/types";

export const TopHeader = async ({
  navItems,
}: {
  navItems: NavSectionProps[];
}) => {
  console.log("----------- validateRequest from TopHeader -----------");
  const { user, session } = await validateRequestSSR();
  console.log("----------- validateRequest from TopHeader -----------");
  if (!user || !session) redirect(redirects.toNonProtected);
  return (
    <header className="p-4 flex justify-between items-center gap-4 h-[4.5rem]">
      <div className="flex items-center gap-4 flex-nowrap">
        <LogoText className="text-3xl" />
        <Logo className="w-7 h-7 hidden xs:block" />
      </div>
      <HeaderMenu email={user.email} navItems={navItems} />
    </header>
  );
};
