"use server"

import { db } from "@/server/db";
import { logError } from "@/lib/utilities/logger";
import { user } from "@/server/db/schema";
import { asc, like } from "drizzle-orm";
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
}: {
  pagination?: { page?: number; pageSize?: number };
  noLimit?: boolean;
  emailFilter?: string;
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
    if (emailFilter) query = whereEmailLike(query, emailFilter).$dynamic();
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

function whereEmailLike<T extends MySqlSelect>(qb: T, email: string) {
  return qb.where(like(user.email, `%${email}%`));


}
