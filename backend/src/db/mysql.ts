import mysql from "mysql2/promise";
import { config } from "../config";

export function createPool() {
  return mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: config.db.port,
    ssl: config.db.ssl,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}
