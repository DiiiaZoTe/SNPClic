import "dotenv/config";

export const db_config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  url: `mysql://${process.env.DATABASE_USERNAME
    }:${process.env.DATABASE_PASSWORD
    }@${process.env.DATABASE_HOST
    }/${process.env.DATABASE_NAME
    }?sslaccept=strict&ssl={"rejectUnauthorized":true}`
};