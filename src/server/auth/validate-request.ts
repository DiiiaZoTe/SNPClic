import { cache } from "react";
import { cookies } from "next/headers";
import { lucia } from "@/server/auth";
import { logError } from "@/lib/utilities/logger";

// MAIN HELPER FUNCTION
// check if session is valid
export const checkSessionValid = async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return { user: null, session: null };
  }
  return await lucia.validateSession(sessionId);
}

// --------------------- Server action / api version ---------------------
// Here we can set cookies and redirect
// DO NOT USE FOR TRPC as we cannot set cookies or redirect

export const uncachedValidateRequestAPI = async () => {
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
  try {
    // check if session is valid
    const result = await checkSessionValid();
    if (!result.session) return result;

    // session was found and not refreshed (normal case), return the result
    if (!result.session.fresh) return result;

    // session was found and refreshed, bypass that and invalidate the session since we cannot set cookies
    if (result.session.fresh) {
      await lucia.invalidateSession(result.session.id);
      return { user: null, session: null };
    }

  } catch (e) { // unexpected error
    logError({
      error: "Error validating request during SSR",
      location: "uncachedValidateRequestSSR",
      otherData: { e },
    })
    return { user: null, session: null };
  }
  // if we reach this point... we definitely have no session
  // we let the caller handle the redirect
  return { user: null, session: null };
}

export const validateRequestSSR = cache(uncachedValidateRequestSSR);

// --------------------------- TRPC version -----------------------------
// during TRPC, we cannot set cookies or redirect

export const uncachedValidateRequestTRPC = async () => {
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
