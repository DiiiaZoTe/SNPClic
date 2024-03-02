import { validateRequest } from "@/server/auth/validate-request";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/auth/redirects";

import { Sidebar } from "@/components/layout/(app)/menu/sidebar/sidebar";
import { SidebarProvider } from "@/components/layout/(app)/menu/sidebar/use-sidebar";
import { navItems } from "@/app/(app)/(protected)/nav-content";
import { TopHeader } from "@/components/layout/(app)/menu/top-header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, session } = await validateRequest();
  if (!user || !session) redirect(redirects.toNonProtected);

  return (
    <div className="flex w-full flex-col h-[100dvh] overflow-clip">
      <TopHeader navItems={navItems} />
      <div className="relative flex flex-1 min-h-0 w-full border-t border-muted ">
        <SidebarProvider>
          <Sidebar sidebarItems={navItems} />
        </SidebarProvider>
        <main className="flex-1 overflow-auto sm:ml-[4.5rem] md:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
}
