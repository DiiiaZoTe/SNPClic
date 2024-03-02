import { cache } from "react";
import { cookies, headers } from "next/headers";
import type { Session, User } from "lucia";
import { lucia } from "@/server/auth";
import { logError } from "@/lib/utilities/logger";

export const uncachedValidateRequest = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  console.log("calling uncachedValidateRequest");

  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return { user: null, session: null };
  }
  console.log("---- DB called");
  const result = await lucia.validateSession(sessionId);
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {
    logError({
      request: headers,
      error: "Error setting session cookie",
      location: "uncachedValidateRequest",
    })
  }
  return result;
};

export const validateRequest = cache(uncachedValidateRequest);

