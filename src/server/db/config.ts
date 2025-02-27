import { env } from "@/env";

console.log(
  `mysql://${env.DATABASE_USERNAME
  }:${env.DATABASE_PASSWORD
  }@${env.DATABASE_HOST
  }:${env.DATABASE_PORT
  }/${env.DATABASE_NAME
  }`
)

export const DB_CONFIG = {
  host: env.DATABASE_HOST,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  url: `mysql://${env.DATABASE_USERNAME
    }:${env.DATABASE_PASSWORD
    }@${env.DATABASE_HOST
    }:${env.DATABASE_PORT
    }/${env.DATABASE_NAME
    }`
  // }?sslaccept=strict&ssl={"rejectUnauthorized":true}`
};