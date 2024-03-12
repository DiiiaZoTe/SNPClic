"use server"

import db from "@/server/db";
import { logError } from "@/lib/utilities/logger";
import { User, passwordResetToken, session, user } from "@/server/db/schema";
import { and, asc, count, eq, like, lt } from "drizzle-orm";
import { withPagination } from "./utilities";
import { MySqlSelect } from "drizzle-orm/mysql-core";

/** Get a user by id (all columns) */
export const getUserById = async ({ id }: { id: string }) => {
  try {
    return db.query.user.findFirst({
      where: (table, { eq }) => eq(table.id, id),
    });
  } catch (e) {
    logError({
      error: "Error getting user by id",
      location: "getUserById",
      otherData: { e },
    })
    return undefined;
  }
}

/** Get a user by email (all columns) */
export const getUserByEmail = async ({ email }: { email: string, }) => {
  try {
    return db.query.user.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });
  } catch (e) {
    logError({
      error: "Error getting user by email",
      location: "getUserByEmail",
      otherData: { e },
    })
    return undefined;
  }
}


/** get all the users (public info like email, role, etc... no password), 
 *  with email filter, paginated limit 10 by default.
 *  @warning  if `noLimit` is true, return all the submissions without limit.
 */
export const getAllUsers = async ({
  pagination = {
    page: 1,
    pageSize: 10,
  },
  noLimit = false,
  emailFilter,
  roleFilter,
}: {
  pagination?: { page?: number; pageSize?: number };
  noLimit?: boolean;
  emailFilter?: string;
  roleFilter?: User["role"];
}) => {
  try {
    let query = db
      .select({
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })
      .from(user)
      .$dynamic();
    query = withWhereFilter(query, {
      emailFilter,
      roleFilter
    }).$dynamic();
    query = query.orderBy(asc(user.email)).$dynamic();
    if (noLimit) return await query;
    return withPagination(query, pagination.page, pagination.pageSize);
  } catch (e) {
    logError({
      error: "Error getting all users",
      location: "getAllUsers",
      otherData: { e },
    })
    return [];
  }
}


function withWhereFilter<T extends MySqlSelect>(
  qb: T,
  {
    emailFilter,
    roleFilter
  }: {
    emailFilter?: string,
    roleFilter?: User["role"]
  }
) {
  return qb.where(and(
    emailFilter ? like(user.email, `%${emailFilter}%`) : undefined,
    roleFilter ? eq(user.role, roleFilter) : undefined
  ))
}

/** get all the users count */
export const getCountUsers = async () => {
  try {
    return db
      .select({ value: count(user.id) })
      .from(user)
  } catch (e) {
    logError({
      error: "Error getting count users",
      location: "getCountUsers",
      otherData: { e },
    })
    return [];
  }
}

/** delete a user by email */
export const deleteUserByEmail = async ({ email }: { email: string, }): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // check if user exists
    const fetchedUser = await getUserByEmail({ email });
    if (!fetchedUser) {
      logError({
        error: "Cannot delete user by email, user not found",
        location: "deleteUserByEmail",
        otherData: { email },
      })
      return { success: false, error: "Utilisateur non trouvé." };
    };
    await db.delete(user).where(eq(user.email, email));
    return { success: true };
  } catch (e) {
    logError({
      error: "Error deleting user by email",
      location: "deleteUserByEmail",
      otherData: { e },
    })
    return { success: false, error: "Erreur lors de la suppression." };
  }
}

/** get the reset password token row */
export const getDBPasswordResetToken = async (token: string) => {
  try {
    return db.query.passwordResetToken.findFirst({
      where: (table, { eq }) => eq(table.id, token),
    });
  } catch (e) {
    logError({
      error: "Error getting password reset token",
      location: "getDBPasswordResetToken",
      otherData: { e },
    })
    return undefined;
  }
}

/** delete the reset password token row */
export const deleteDBPasswordResetToken = async (token: string): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const result = await db.delete(passwordResetToken).where(eq(passwordResetToken.id, token));
    return { success: true };
  } catch (e) {
    logError({
      error: "Error deleting password reset token",
      location: "deleteDBPasswordResetToken",
      otherData: { e },
    })
    return { success: false, error: "Error deleting the password reset token" };
  }
}

/** update a user's password */
export const updateUserPassword = async ({ userId, newHashedPassword }: { userId: string, newHashedPassword: string }) => {
  try {
    const [updateUser] = await db.update(user).set({
      hashedPassword: newHashedPassword,
    }).where(eq(user.id, userId));
    if (updateUser.affectedRows === 0) {
      logError({
        error: `User not found ${userId}`,
        location: "updateUserPassword",
      })
      return false;
    }
    return true;
  } catch (e) {
    logError({
      error: `Error updating user password ${userId}`,
      location: "updateUserPassword",
      otherData: { e },
    })
    return false;
  }
}

/** delete all user expired sessions */
export const deleteAllUserExpiredSessions = async ({ userId }: { userId: string }) => {
  try {
    await db.delete(session).where(and(
      eq(session.userId, userId),
      lt(session.expiresAt, new Date())
    ));
  } catch (e) {
    logError({
      error: `Error deleting all user expired sessions ${userId}`,
      location: "deleteAllUserExpiredSessions",
      otherData: { e },
    })
  }
}