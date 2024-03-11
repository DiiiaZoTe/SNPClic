"use server"

import { db } from "@/server/db";
import { logError } from "@/lib/utilities/logger";

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

export const getUserByEmail = async ({ email }: { email: string }) => {
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