import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Client } from "@planetscale/database";

import * as schema from "./schema";

export const db = drizzle(
  new Client({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  }).connection(),
  { schema }
);