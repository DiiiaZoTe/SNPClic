import { validateRequestSSR } from "@/server/auth/validate-request";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/auth/redirects";

import { Logo } from "@/components/logos/logo";
import { LogoText } from "@/components/logos/logo-text";
import { HeaderMenu } from "@/components/layout/(app)/menu/header-menu";
import { NavSectionProps } from "@/components/layout/(app)/menu/types";
import { NavMenu } from "./nav-menu";

export const TopHeader = async ({
  navItems,
}: {
  navItems: NavSectionProps[];
}) => {
  const { user, session } = await validateRequestSSR();
  if (!user || !session) redirect(redirects.toNonProtected);
  return (
    <header className="flex flex-col w-full">
      <div className="w-full flex justify-between items-center gap-4 px-4 pt-2 pb-2 sm:pb-0">
        <div className="flex items-center gap-4 flex-nowrap">
          <LogoText className="text-3xl" />
          <Logo className="w-7 h-7 hidden xs:block" />
        </div>
        <HeaderMenu email={user.email} navItems={navItems} />
      </div>
      <NavMenu navItems={navItems} />
    </header>
  );
};
