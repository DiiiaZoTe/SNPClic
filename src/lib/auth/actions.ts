"use server";

import { validateRequest } from "@/server/auth/validate-request";
import { cookies, headers } from "next/headers";
import { logError } from "@/lib/utilities/logger";
import { lucia } from "@/server/auth";
import { redirect } from "next/navigation";
import { redirects } from "./redirects";

export async function logout() {
  try {

    const { session } = await validateRequest();
    if (!session) {
      logError({
        request: headers,
        error: `No session found to log out`,
        location: `/api/trpc/auth.logout`,
      });
      return { success: false, error: "Aucune session trouvée pour se déconnecter" };
    }
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    logError({
      request: headers,
      error: `Failed to log out`,
      location: `logout server action (src/lib/auth/actions.ts)`,
      otherData: { error }
    });
    return { success: false, error: "Échec de la déconnexion" };
  } finally {
    redirect(redirects.afterLogout);
  }
}