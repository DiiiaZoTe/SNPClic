import { MySqlSelect } from "drizzle-orm/mysql-core";


export function withPagination<T extends MySqlSelect>(
  qb: T,
  page: number = 1,
  pageSize: number = 10,
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}