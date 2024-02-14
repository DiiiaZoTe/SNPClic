import { env } from "@/env";

export const db_config = {
  host: env.DATABASE_HOST,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  url: `mysql://${env.DATABASE_USERNAME
    }:${env.DATABASE_PASSWORD
    }@${env.DATABASE_HOST
    }/${env.DATABASE_NAME
    }?sslaccept=strict&ssl={"rejectUnauthorized":true}`
};