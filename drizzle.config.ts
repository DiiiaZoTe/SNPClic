import { type Config } from "drizzle-kit";
import { DB_CONFIG } from "./src/server/db/config";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: DB_CONFIG.url,
  },
} satisfies Config;
