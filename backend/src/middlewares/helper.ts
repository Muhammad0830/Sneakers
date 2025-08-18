import { createPool } from "../db/mysql";
import { RowDataPacket, FieldPacket } from "mysql2";

const pool = createPool();

function sqlWithNamedParams(sql: string, params: Record<string, any>) {
  const values: any[] = [];
  const parsedSql = sql.replace(/:(\w+)/g, (_, key) => {
    if (!(key in params)) {
      throw new Error(`Missing SQL param: ${key}`);
    }
    values.push(params[key]);
    return "?";
  });
  return { sql: parsedSql, values };
}

export async function query<T extends RowDataPacket[]>(
  sql: string,
  params?: any
): Promise<T> {
  let finalSql = sql;
  let values: any[] | undefined;

  if (params) {
    if (Array.isArray(params)) {
      values = params;
    } else {
      const result = sqlWithNamedParams(sql, params);
      finalSql = result.sql;
      values = result.values;
    }
  }

  const [rows]: [T, FieldPacket[]] = values
    ? await pool.query(finalSql, values)
    : await pool.query(finalSql);

  return rows;
}
