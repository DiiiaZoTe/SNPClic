import { getFakeSession } from "../get-fake-session";

import { Logo } from "@/components/logos/logo";
import { LogoText } from "@/components/logos/logo-text";

import { Sidebar } from "@/components/layout/(app)/sidebar/sidebar";
import { SidebarProvider } from "@/components/layout/(app)/sidebar/use-sidebar";

import { sidebarItems } from "@/app/(app)/(protected)/nav-content";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { user, session } = await validateRequest();
  // if (!user || !session) redirect(redirects.toNonProtected);

  return (
    <div className="flex w-full flex-col h-[100dvh] overflow-clip">
      <TopHeader />
      <div className="relative flex flex-1 min-h-0 w-full border-t border-muted ">
        <SidebarProvider>
          <Sidebar sidebarItems={sidebarItems} />
        </SidebarProvider>
        <main className="flex-1 overflow-auto sm:ml-[4.5rem] md:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export const TopHeader = () => {
  // const { user, session } = await validateRequest();
  // if (!user || !session) redirect(redirects.toNonProtected);
  const { user } = getFakeSession();
  const email = user?.email ?? "Mon compte";
  return (
    <header className="p-4 flex justify-between items-center gap-4">
      <div className="flex items-center gap-4 flex-nowrap">
        <LogoText className="text-2xl" />
        <Logo className="w-6 h-6" />
      </div>
      <span className="min-w-0 truncate">{email}</span>
      {/* <div className="flex items-center gap-2 truncate">
        <User2 className="w-4 h-4 hidden sm:block" />
      </div> */}
      {/* <Button asChild variant="ghost">
        <MyLink href="/dashboard" className="flex items-center gap-2">
          <span>{email}</span>
          <User2 className="w-4 h-4" />
        </MyLink>
      </Button> */}
    </header>
  );
};
