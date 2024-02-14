import { type Config } from "drizzle-kit";
import { db_config } from "./src/server/db/config";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: db_config.url,
  },
} satisfies Config;
