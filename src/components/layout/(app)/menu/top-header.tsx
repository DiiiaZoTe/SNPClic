import { getFakeSession } from "@/app/(app)/get-fake-session";

import { Logo } from "@/components/logos/logo";
import { LogoText } from "@/components/logos/logo-text";
import { HeaderMenu } from "@/components/layout/(app)/menu/header-menu";
import { NavSectionProps } from "@/components/layout/(app)/menu/types";

export const TopHeader = ({ navItems }: { navItems: NavSectionProps[] }) => {
  // const { user, session } = await validateRequest();
  // if (!user || !session) redirect(redirects.toNonProtected);
  const { user } = getFakeSession();
  return (
    <header className="p-4 flex justify-between items-center gap-4">
      <div className="flex items-center gap-4 flex-nowrap">
        <LogoText className="text-2xl" />
        <Logo className="w-6 h-6" />
      </div>
      <HeaderMenu email={user.email} navItems={navItems} />
    </header>
  );
};
