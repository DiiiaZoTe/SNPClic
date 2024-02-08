import { type Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: `mysql://${process.env.DATABASE_USERNAME
      }:${process.env.DATABASE_PASSWORD
      }@${process.env.DATABASE_HOST
      }/${process.env.DATABASE_NAME
      }?sslaccept=strict&ssl={"rejectUnauthorized":true}`
  },
} satisfies Config;
