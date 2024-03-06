"server only";

import { db } from "@/server/db";
import { emailVerificationCode, passwordResetToken, user } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { Scrypt, generateId } from "lucia";
import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { logError } from "@/lib/utilities/logger";
import { headers } from "next/headers";

/** 
 * Insert a new account into the database and return the user id.
 * If user exists or insert error, return `undefined`.
 */
export async function insertNewAccount(email: string, password: string) {
  try {
    const existingUser = await db.query.user.findFirst({
      where: (table, { eq }) => eq(table.email, email),
      columns: { email: true },
    });

    if (existingUser) {
      logError({
        request: headers(),
        error: `Sign up fail, account ${email} already exists`,
        location: `auth utilities insertNewAccount`,
      });
      return undefined;
    }

    const userId = generateId(21);
    const hashedPassword = await new Scrypt().hash(password);
    const insertNewUser = await db.insert(user).values({
      id: userId,
      email: email,
      hashedPassword,
    });
    if (!insertNewUser.insertId) {
      logError({
        request: headers(),
        error: `Failed to insert new user ${email}`,
        location: `auth utilities insertNewAccount`,
      });
      return undefined;
    };
    return userId;
  } catch (error) {
    logError({
      request: headers(),
      error: `Unexpected error creating new user ${email}`,
      location: `auth utilities insertNewAccount`,
      otherData: { error }
    });
    return undefined;
  }
}

/** Creates a new account with temp password */
export async function insertNewAccountWithTemporaryPassword(email: string) {
  const temporaryPassword = generateTemporaryPassword();
  const userId = await insertNewAccount(email, temporaryPassword);
  if (!userId) return undefined;
  return { userId, temporaryPassword };
}

/** Generates a temporary 16 charachet password */
export function generateTemporaryPassword() {
  return generateRandomString(16, alphabet("0-9", "a-z", "A-Z"));

}

/** Generate a new email verification code for user */
export async function generateEmailVerificationCode(
  userId: string,
  email: string,
) {
  try {
    await db.delete(emailVerificationCode).where(eq(emailVerificationCode.userId, userId));
    const code = generateRandomString(8, alphabet("0-9")); // 8 digit code
    await db.insert(emailVerificationCode).values({
      userId,
      email,
      code,
      expiresAt: createDate(new TimeSpan(10, "m")), // 10 minutes
    });
    return code;
  } catch (error) {
    logError({
      request: `generateEmailVerificationCode`,
      error: `Failed to generate password reset token for user ${userId} and email ${email}`,
      location: `/api/trpc/auth.generateEmailVerificationCode`,
      otherData: { error }
    });
    return undefined;
  }
}

/** Inserts a new password reset token for user */
export async function generatePasswordResetToken(userId: string) {
  try {
    await db.delete(passwordResetToken).where(eq(passwordResetToken.userId, userId));
    const tokenId = generateId(40);
    await db.insert(passwordResetToken).values({
      id: tokenId,
      userId,
      expiresAt: createDate(new TimeSpan(2, "h")),
    });
    return tokenId;
  } catch (error) {
    logError({
      request: `generatePasswordResetToken`,
      error: `Failed to generate password reset token for user ${userId}`,
      location: `/api/trpc/auth.generatePasswordResetToken`,
      otherData: { error }
    });
    return undefined;
  }
}

/** Get the time between now and the date given */
export const timeFromNow = (time: Date) => {
  const now = new Date();
  const diff = time.getTime() - now.getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  const seconds = Math.floor(diff / 1000) % 60;
  return `${minutes}m ${seconds}s`;
};