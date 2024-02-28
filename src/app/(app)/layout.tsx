import { SessionProvider } from "@/lib/auth/session-context";
import { validateRequest } from "@/server/auth/validate-request";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();
  return <SessionProvider value={session}>{children}</SessionProvider>;
}
