import { SessionProvider } from "@/lib/auth/session-context";
import { validateRequestSSR } from "@/server/auth/validate-request";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/auth/redirects";

import {
  userNavItems,
  adminNavItems,
} from "@/app/(app)/(protected)/nav-content";
import { TopHeader } from "@/components/layout/(app)/menu/top-header";

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
      <div className="flex w-full flex-col h-[100svh] overflow-clip">
        <TopHeader navItems={navItems} />
        <main className="flex flex-1 min-h-0 w-full border-t border-muted ">
          <div className="w-full h-full flex flex-col py-8 overflow-y-auto">
            <div className="container w-full flex-1">{children}</div>
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
