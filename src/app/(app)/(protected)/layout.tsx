import { SessionProvider } from "@/lib/auth/session-context";
import { validateRequestSSR } from "@/server/auth/validate-request";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/auth/redirects";

import {
  userNavItems,
  adminNavItems,
} from "@/app/(app)/(protected)/nav-content";
import { TopHeader } from "@/components/layout/(app)/menu/top-header";
import { ScrollArea } from "@/components/ui/scroll-area";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, session } = await validateRequestSSR();
  if (!user || !session) redirect(redirects.toNonProtected);
  let navItems = userNavItems;
  if (user.role === "admin") navItems = adminNavItems;

  return (
    <SessionProvider value={{ user, session }}>
      <div className="flex w-full flex-col">
        <TopHeader navItems={navItems} />
        <ScrollArea className="w-full border-t border-muted">
          <main className=" h-[calc(100svh-105px)] flex min-h-0 w-full flex-col">
            <div className="container w-full flex-1 py-8">{children}</div>
          </main>
        </ScrollArea>
      </div>
    </SessionProvider>
  );
}
