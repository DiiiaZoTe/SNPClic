import { type Config } from "drizzle-kit";
import { DB_CONFIG } from "./src/server/db/config";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: DB_CONFIG.url,
  },
} satisfies Config;
