import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Client } from "@planetscale/database";

import * as schema from "./schema";
import { db_config } from "./config";

export const db = drizzle(
  new Client({
    url: db_config.url,
  }),
  { schema }
);