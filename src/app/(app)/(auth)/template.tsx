import { redirects } from "@/lib/auth/redirects";
import { validateRequestSSR } from "@/server/auth/validate-request";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequestSSR();
  if (user) redirect(redirects.toProtected);

  return <>{children}</>;
}
