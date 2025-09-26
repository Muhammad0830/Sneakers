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

export async function updateUser(id: number, name: string) {
  const res = await query(`UPDATE users SET name = :name WHERE id = :id`, {
    id: id,
    name: name,
  });
}

export async function findFavourites(userId: number) {
  const rows = await query(
    `SELECT p.*, fp.created_at as created_at, 
    COALESCE(s.discount_type, NULL) AS discount_type, COALESCE(s.discount_value, NULL) AS discount_value, COALESCE(s.sale_to, null) as sale_to, COALESCE(s.sale_from, null) as sale_from
    FROM products as p
    LEFT JOIN on_sale as s ON p.id = s.product_id
    AND NOW() BETWEEN s.sale_from AND s.sale_to AND s.status = 'active'
    JOIN favouriteProducts as fp on fp.productId = p.id and userId = :userId ORDER BY fp.created_at DESC`,
    {
      userId,
    }
  );
  return rows as any[];
}

export async function deleteFavourite(productId: number, userId: number) {
  const res = await query(
    `DELETE FROM favouriteProducts WHERE userId = :userId AND productId = :productId`,
    {
      userId,
      productId,
    }
  );
}

export async function findMyCommentsWithProducts(userId: number) {
  const rows = await query(
    `SELECT p.*, pc.id as commentId, pc.comment, pc.created_at as commentCreatedAt
    FROM products as p
    JOIN productComments as pc ON pc.userId = :userId AND pc.productId = p.id`,
    {
      userId,
    }
  );

  return rows as any[];
}

export async function updateComment(
  commentId: number,
  userId: number,
  comment: string
) {
  const res = await query(
    `SELECT * FROM productComments WHERE userId = :userId AND id = :commentId`,
    {
      userId,
      commentId,
    }
  );

  if (res.length <= 0) throw new Error("comment not found");

  await query(
    `UPDATE productComments SET comment = :comment WHERE id = :commentId`,
    {
      commentId,
      comment,
    }
  );
}
