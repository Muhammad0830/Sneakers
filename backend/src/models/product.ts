import { ResultSetHeader, RowDataPacket } from "mysql2";
import { query } from "../middlewares/helper";
import { Product } from "../types/snaekers";

export const LikeProduct = async (productId: number, userId: number) => {
  try {
    await query(
      `INSERT INTO favouriteProducts (productId, userId) 
      VALUES (:productId, :userId)`,
      {
        productId,
        userId,
      }
    );
  } catch (err: any) {
    throw new Error(err);
  }
};

export const UnLikeProduct = async (productId: number, userId: number) => {
  try {
    await query(
      `DELETE FROM favouriteProducts 
      WHERE productId = :productId AND userId = :userId`,
      {
        productId,
        userId,
      }
    );
  } catch (err: any) {
    throw new Error(err);
  }
};

export const AddToCart = async (
  productId: number,
  userId: number,
  quantity: number,
  size: string,
  color: string
) => {
  try {
    if (!quantity) {
      await query(
        `DELETE FROM inCartProducts WHERE userId = :userId AND productId = :productId AND size = :size AND color = :color`,
        {
          productId,
          userId,
          size,
          color,
        }
      );

      return;
    }

    const product = await query<RowDataPacket[]>(
      `SELECT * FROM inCartProducts WHERE userId = :userId AND productId = :productId AND size = :size AND color = :color`,
      {
        productId,
        userId,
        size,
        color,
      }
    );

    if (product.length > 0) {
      await query(
        `UPDATE inCartProducts SET quantity = :quantity WHERE userId = :userId AND productId = :productId AND size = :size AND color = :color`,
        {
          productId,
          userId,
          quantity,
          size,
          color,
        }
      );

      return;
    }

    await query<ResultSetHeader>(
      `INSERT INTO inCartProducts (productId, userId, size, color, quantity) 
        VALUES (:productId, :userId, :size, :color, :quantity)`,
      {
        productId,
        userId,
        size,
        color,
        quantity,
      }
    );
  } catch (err: any) {
    throw new Error(err);
  }
};

export const RateProduct = async (
  productId: number,
  userId: number,
  rating: number
) => {
  try {
    const product = await query<RowDataPacket[]>(
      `SELECT * FROM products WHERE id = :productId`,
      {
        productId,
      }
    );

    if (product.length <= 0) {
      throw new Error("product not found");
    }

    const result = await query<RowDataPacket[]>(
      `SELECT * FROM ratedProducts WHERE userId = :userId AND productId = :productId`,
      {
        productId,
        userId,
      }
    );

    if (result.length > 0) {
      await query(
        `UPDATE ratedProducts SET rating = :rating WHERE userId = :userId AND productId = :productId`,
        {
          productId,
          userId,
          rating,
        }
      );
      return;
    }

    await query(
      `INSERT INTO ratedProducts (productId, userId, rating) VALUES (:productId, :userId, :rating)`,
      {
        productId,
        userId,
        rating,
      }
    );

    return;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const calcProductRating = async (
  productId: number,
  userId: number,
  rating: number
) => {
  try {
    const countResult = await query<RowDataPacket[]>(
      `SELECT COUNT (*) as count FROM ratedProducts WHERE productId = :productId`,
      {
        productId,
      }
    );
    const count = (countResult[0] as { count: number }).count;

    const productCurrentRating = await query<RowDataPacket[]>(
      `SELECT rating FROM products where id = :productId`,
      {
        productId,
      }
    );
    const RatingValue = (
      productCurrentRating[0] as {
        rating: number;
      }
    ).rating;

    const result = await query<RowDataPacket[]>(
      `SELECT * FROM ratedProducts WHERE userId = :userId AND productId = :productId`,
      {
        userId,
        productId,
      }
    );

    let newAverageRating;

    if (result.length > 0) {
      const oldRatingResult = await query<RowDataPacket[]>(
        `SELECT rating FROM ratedProducts WHERE productId = :productId AND userId = :userId`,
        {
          productId,
          userId,
        }
      );
      const oldRatingValue = (oldRatingResult[0] as { rating: number }).rating;

      newAverageRating = (
        Number(RatingValue) -
        (Number(oldRatingValue) - rating) / count
      ).toFixed(2);
    } else {
      newAverageRating = ((Number(RatingValue) + rating) / (count + 1)).toFixed(
        2
      );
    }

    await query(
      `UPDATE products SET rating = :newRating where id = :productId`,
      {
        newRating: newAverageRating,
        productId,
      }
    );
  } catch (err: any) {
    throw new Error(err);
  }
};

export const commentAboutProduct = async (
  productId: number,
  userId: number,
  comment: string
) => {
  try {
    const result = await query<RowDataPacket[]>(
      `SELECT * FROM products WHERE id = :productId`,
      {
        productId,
      }
    );

    if (result.length <= 0) throw new Error("product not found");

    await query(
      `INSERT INTO productComments (productId, userId, comment) 
      VALUES (:productId, :userId, :comment)`,
      {
        productId,
        userId,
        comment,
      }
    );
  } catch (err: any) {
    throw new Error(err);
  }
};

export const deleteComment = async (commentId: number) => {
  try {
    await query(`DELETE FROM productComments WHERE id = :commentId`, {
      commentId,
    });
  } catch (err: any) {
    throw new Error(err);
  }
};

export const getInCartProducts = async (userId: number) => {
  try {
    const rows = await query<RowDataPacket[]>(
      `SELECT p.*,
        CASE WHEN f.id is not null then 1 else 0 end as is_liked, 
        COALESCE(s.discount_type, NULL) AS discount_type, COALESCE(s.discount_value, NULL) AS discount_value, COALESCE(s.sale_to, null) as sale_to, COALESCE(s.sale_from, null) as sale_from,
        cp.id as inCartId, cp.created_at as cartProductCreatedAt, cp.quantity, cp.size as selectedSize, cp.color as selectedColor
        FROM products as p
        LEFT JOIN favouriteProducts f on p.id = f.productId AND f.userId = :userId
        LEFT JOIN on_sale as s ON p.id = s.product_id
          AND NOW() BETWEEN s.sale_from AND s.sale_to AND s.status = 'active'
        JOIN inCartProducts as cp on p.id = cp.productId AND cp.userId = :userId`,
      {
        userId,
      }
    );
    return rows;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const checkIfUserLikedProduct = async (id: number, userId: number) => {
  try {
    const rows = await query<RowDataPacket[]>(
      `SELECT * FROM favouriteProducts WHERE userId = :userId AND productId = :productId`,
      {
        userId,
        productId: id,
      }
    );
    return rows;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const placeAnOrder = async (
  userId: number,
  name: string,
  phoneNumber: string,
  address: string,
  selectedMethod: string,
  cardholderName: string,
  cardNumber: string,
  expiryDate: string,
  cvv: string,
  cartItems: any[]
) => {
  try {
    for (const item of cartItems) {
      const result = await query<ResultSetHeader>(
        `INSERT INTO orders (userId, productId, size, color, quantity) VALUES (:userId, :productId, :size, :color, :quantity)`,
        {
          userId,
          productId: item.product.id,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        }
      );

      const insertId = result.insertId;

      await query(
        `INSERT INTO orderDetails (orderId, name, phoneNumber, address, paymentMethod, cardholderName, cardNumber, expiryDate, cvv)
        VALUES (:orderId, :name, :phoneNumber, :address, :paymentMethod, :cardholderName, :cardNumber, :expiryDate, :cvv)`,
        {
          orderId: insertId,
          name: name,
          phoneNumber: phoneNumber,
          address: address,
          paymentMethod: selectedMethod,
          cardholderName: cardholderName,
          cardNumber: cardNumber,
          expiryDate: expiryDate,
          cvv: cvv,
        }
      );
    }
  } catch (err: any) {
    throw new Error(err);
  }
};
