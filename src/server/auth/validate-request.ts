import { cache } from "react";
import { cookies } from "next/headers";
import { lucia } from "@/server/auth";
import { logError } from "@/lib/utilities/logger";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/auth/redirects";

// MAIN HELPER FUNCTION
// check if session is valid
export const checkSessionValid = async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return { user: null, session: null };
  }
  console.log("---- DB called");

  return await lucia.validateSession(sessionId);

}

// --------------------- Server action / api version ---------------------
// Here we can set cookies and redirect
// DO NOT USE FOR TRPC as we cannot set cookies or redirect

export const uncachedValidateRequestAPI = async () => {
  console.log("calling uncachedValidateRequest");
  try {
    const result = await checkSessionValid();

    // if no session, create a blank session
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return result;
    };

    // extend the session cookie if it is fresh
    if (result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }

    return result;

  } catch (e) {
    logError({
      error: "Error validating request",
      location: "uncachedValidateRequest",
      otherData: { e },
    })
    return { user: null, session: null };
  }
};

export const validateRequestAPI = cache(uncachedValidateRequestAPI);


// --------------------------- SSR version --------------------------------
// during SSR, we cannot set cookies but we can redirect

export const uncachedValidateRequestSSR = async () => {
  console.log("calling uncachedValidateRequestSSR");
  try {
    // check if session is valid
    const result = await checkSessionValid();
    if (!result.session) return result;

    // session was found and refreshed, bypass that and invalidate the session since we cannot set cookies
    if (result.session.fresh) {
      await lucia.invalidateSession(result.session.id);
      redirect(redirects.afterLogout);
    }
    return result;

  } catch (e) { // unexpected error
    logError({
      error: "Error validating request during SSR",
      location: "uncachedValidateRequestSSR",
      otherData: { e },
    })
    return { user: null, session: null };
  }
}

export const validateRequestSSR = cache(uncachedValidateRequestSSR);

// --------------------------- TRPC version -----------------------------
// during TRPC, we cannot set cookies or redirect

export const uncachedValidateRequestTRPC = async () => {
  console.log("calling uncachedValidateRequestTRPC");
  try {
    // check if session is valid
    const result = await checkSessionValid();
    if (!result.session) return result;

    // session was found and refreshed, bypass that and invalidate the session since we cannot set cookies
    if (result.session.fresh) {
      await lucia.invalidateSession(result.session.id);
      return { user: null, session: null };
    }
    return result;

  } catch (e) { // unexpected error
    logError({
      error: "Error validating request during TRPC",
      location: "uncachedValidateRequestTRPC",
      otherData: { e },
    })
    return { user: null, session: null };
  }
}

export const validateRequestTRPC = cache(uncachedValidateRequestTRPC);
