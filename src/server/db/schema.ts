import {
  bigint,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";

export const test = mysqlTable(
  "test",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }),
  }
);

