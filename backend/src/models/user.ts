import { query } from "../middlewares/helper";

export async function findUserByEmail(email: string) {
  const rows = await query("SELECT * FROM users WHERE email = ?", [email]);
  const arr = rows as any[];
  return arr[0] ?? null;
}

export async function findUserById(id: number) {
  const rows = await query("SELECT * FROM users WHERE id = ?", [id]);
  const arr = rows as any[];
  return arr[0] ?? null;
}

export async function createUser(
  email: string,
  passwordHash: string,
  name?: string
) {
  const res: any = await query(
    "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
    [email, passwordHash, name ?? null]
  );
  return res.insertId as number;
}
