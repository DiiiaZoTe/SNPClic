"use server";

import { logError } from "@/lib/utilities/logger";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { lucia } from "@/server/auth";
import { redirects } from "@/lib/auth/redirects";
import { loginSchema } from "@/lib/auth/schemas";
import { Scrypt } from "lucia";
import { revalidatePath } from "next/cache";
import { deleteAllUserExpiredSessions, getUserByEmail } from "@/server/db/queries/auth";


export async function logoutAction() {
  try {
    // get the session and invalidate
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (sessionId) {
      await lucia.invalidateSession(sessionId);
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch (error) { // unexpected error
    logError({
      request: headers(),
      error: `Failed to log out`,
      location: `action logout`,
      otherData: { error },
    });
    return {
      logoutError: `Échec de la déconnexion.`,
    }
  }
  // redirect to the page after logout
  revalidatePath("/");
  redirect(redirects.afterLogout);
}


export async function loginAction(
  _: any,
  //since we use reactHookForm we don't get form data but the parsed input
  data: FormData
) {
  try {
    // parse form data and get input
    const obj = Object.fromEntries(data);
    const schemaValid = loginSchema.safeParse(obj);
    if (!schemaValid.success) {
      const err = schemaValid.error.flatten();
      logError({
        request: headers(),
        error: `Invalid login request`,
        location: `action login`,
        otherData: { errors: schemaValid.error },
      });
      return {
        fieldError: {
          email: err.fieldErrors.email?.[0],
          password: err.fieldErrors.password?.[0],
        },
        loginError: `Requête de connexion invalide.`,
      }
    }
    const input = schemaValid.data

    // prepare error response
    const invalidResponse = {
      fieldError: null,
      loginError: `Email ou mot de passe invalide.`,
    }

    // find user in database
    const existingUser = await getUserByEmail({ email: input.email });

    // check if user exists and has a password hash
    if (!existingUser || !existingUser.hashedPassword) {
      logError({
        request: headers(),
        error: `No user found with email ${input.email} or no password hash found`,
        location: `/api/trpc/auth.login`,
        otherData: { existingUser },
      });
      return invalidResponse;
    }

    // verify password
    const validPassword = await new Scrypt().verify(
      existingUser.hashedPassword,
      input.password
    );
    if (!validPassword) {
      logError({
        request: headers(),
        error: `Invalid login password for ${input.email}`,
        location: `/api/trpc/auth.login`,
      });
      return invalidResponse;
    }

    // all good! create a new session and set the cookie
    const newSession = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(newSession.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    // * extra logic to keep the sessions table clean
    // send a request to delete all the expired sessions of the user
    // this is a background task and we don't need to wait for it
    // this will also help to keep the sessions table clean
    // we could have used a cron job for this but it's not necessary
    deleteAllUserExpiredSessions({ userId: existingUser.id })

  } catch (error) { // unexpected error
    logError({
      request: headers(),
      error: `Failed to log in`,
      location: `action login`,
      otherData: { error },
    });
    return {
      fieldError: null,
      loginError: `Échec de la connexion.`,
    }
  }

  // redirect to the page after login
  redirect(redirects.afterLogin);

}