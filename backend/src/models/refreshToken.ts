import { query } from "../middlewares/helper";

export async function saveRefreshToken(
  userId: number,
  token: string,
  expiresAt: string
) {
  await query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (:userId, :token, :expiresAt)",
    { userId: userId, token: token, expiresAt: expiresAt }
  );
}

export async function deleteRefreshToken(token: string) {
  await query("DELETE FROM refresh_tokens WHERE token = ?", [token]);
}

export async function findRefreshToken(token: string) {
  const rows = await query("SELECT * FROM refresh_tokens WHERE token = ?", [
    token,
  ]);
  const arr = rows as any[];
  return arr[0] ?? null;
}

export async function deleteTokensForUser(userId: number) {
  await query("DELETE FROM refresh_tokens WHERE user_id = ?", [userId]);
}
