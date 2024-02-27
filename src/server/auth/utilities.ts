import { db } from "@/server/db";
import { emailVerificationCode, passwordResetToken } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { logError } from "../../lib/utilities/logger";

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


export const timeFromNow = (time: Date) => {
  const now = new Date();
  const diff = time.getTime() - now.getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  const seconds = Math.floor(diff / 1000) % 60;
  return `${minutes}m ${seconds}s`;
};