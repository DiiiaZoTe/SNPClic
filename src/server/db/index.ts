// import { MySql2Database, drizzle } from "drizzle-orm/mysql2";
// import mysql, { Pool, PoolConnection } from "mysql2/promise";

// import * as schema from "./schema";
// import { DB_CONFIG } from "./config";

// const connection = mysql.createPool({
//   uri: DB_CONFIG.url,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   idleTimeout: 5000,
// });
// export const db = drizzle(connection, { schema, mode: "default" });

// drizzleConnectionManager.ts
import { MySql2Database, drizzle } from "drizzle-orm/mysql2";
import mysql, { Pool, PoolConnection } from "mysql2/promise";
import * as schema from "./schema"; // Adjust the import path as needed
import { DB_CONFIG } from "./config"; // Adjust the import path as needed

class DrizzleConnectionManager {
  private static instance: DrizzleConnectionManager;
  public db: MySql2Database<typeof schema>;
  public pool: Pool;

  private constructor() {
    this.pool = mysql.createPool({
      uri: DB_CONFIG.url,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      idleTimeout: 5000,
    });

    this.db = drizzle(this.pool, { schema, mode: "default" });
  }

  public static getInstance(): DrizzleConnectionManager {
    if (!DrizzleConnectionManager.instance) {
      DrizzleConnectionManager.instance = new DrizzleConnectionManager();
    }
    return DrizzleConnectionManager.instance;
  }
}

//Create global variable so it would not get overwritten or removed when hotreload happens
declare global {
  var db: MySql2Database<typeof schema>;
}
//Check if global instance is already available  if not then you can get new instance if global instance is available then it would //use that instead and assign to variable where you will return so you can use it to other api files . 
//Check if environment is in production or not . if it is then it would set the global instance from instance instead . 
if (process.env.NODE_ENV !== 'production' && !global.db) {
  global.db = DrizzleConnectionManager.getInstance().db;
}
if (process.env.NODE_ENV === 'production') {
  global.db = DrizzleConnectionManager.getInstance().db;
}
export default db;