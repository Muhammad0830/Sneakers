import { createPool } from "../db/mysql";
import { RowDataPacket, FieldPacket } from "mysql2";
const pool = createPool();

export async function query<T extends RowDataPacket[]>(
  sql: string,
  params?: any
): Promise<T> {
  const [rows]: [T, FieldPacket[]] = await pool.query(sql, params);
  return rows;
}
