import { SessionProvider } from "@/lib/auth/session-context";
import { validateRequest } from "@/server/auth/validate-request";
import { getFakeSession } from "./get-fake-session";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the user and session from the request
  // This will be cached for subsequent requests during same render
  // const session = await validateRequest();
  const session = getFakeSession();
  return <SessionProvider value={session}>{children}</SessionProvider>;
}
