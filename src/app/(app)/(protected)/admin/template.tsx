import { redirects } from "@/lib/auth/redirects";
import { validateRequestSSR } from "@/server/auth/validate-request";
import { redirect } from "next/navigation";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, session } = await validateRequestSSR();
  if (!user || !session) redirect(redirects.toNonProtected);
  if (user.role !== "admin") redirect(redirects.toNonAdmin);

  return <>{children}</>;
}
