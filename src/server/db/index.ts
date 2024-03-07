import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import * as schema from "./schema";
import { DB_CONFIG } from "./config";

const connection = mysql.createPool({
  uri: DB_CONFIG.url,
});
export const db = drizzle(connection, { schema, mode: "default" });