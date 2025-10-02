import express from "express";
import { createPool } from "../db/mysql";
import { query } from "../middlewares/helper";
import { Product, Trending, Testimonial } from "../types/snaekers";
import { optionalAuth, requireAuth } from "../middlewares/auth";
import {
  AddToCart,
  calcProductRating,
  checkIfUserLikedProduct,
  commentAboutProduct,
  deleteComment,
  getInCartProducts,
  LikeProduct,
  placeAnOrder,
  RateProduct,
  UnLikeProduct,
} from "../models/product";

const sneakersRouter = express.Router();

sneakersRouter.get("/", optionalAuth, async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = (page - 1) * limit;
    const fetchType = req.query.fetchType as string;
    const userId = req.user?.userId;

    const genders = req.query.gender; // can be string or array
    const colors = req.query.color;
    const sizes = req.query.size;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;

    const allowedSortFields = ["popular", "sale", "top", "new"];
    let sortBy = "id";
    if (allowedSortFields.includes(req.query.sortBy as string)) {
      if (req.query.sortBy === "new") sortBy = "created_at";
      else if (req.query.sortBy === "top") sortBy = "rating";
      else if (req.query.sortBy === "popular") sortBy = "JSON_LENGTH(reviews)";
      else if (req.query.sortBy === "sale") sortBy = "discount_value";
      else sortBy = req.query.sortBy as string;
    }

    const order = req.query.order === "desc" ? "DESC" : "ASC";

    const whereClauses: string[] = [];
    const params: any = { limit, offset };

    if (genders) {
      if (Array.isArray(genders)) {
        whereClauses.push(`gender IN (:genders)`);
        params.genders = genders;
      } else {
        whereClauses.push(`gender = :gender`);
        params.gender = genders;
      }
    }
    if (colors) {
      if (Array.isArray(colors)) {
        const colorConditions = colors.map(
          (c, i) => `FIND_IN_SET(:color${i}, REPLACE(color, ' ', ''))`
        );
        whereClauses.push(`(${colorConditions.join(" OR ")})`);

        // Add parameters
        colors.forEach((c, i) => {
          params[`color${i}`] = c;
        });
      } else {
        whereClauses.push(`FIND_IN_SET(:color, REPLACE(color, ' ', ''))`);
        params.color = colors;
      }
    }

    if (sizes) {
      if (Array.isArray(sizes)) {
        const sizeConditions = sizes.map(
          (s, i) => `FIND_IN_SET(:size${i}, REPLACE(size, ' ', ''))`
        );
        whereClauses.push(`(${sizeConditions.join(" OR ")})`);
        sizes.forEach((s, i) => {
          params[`size${i}`] = s;
        });
      } else {
        whereClauses.push(`FIND_IN_SET(:size, REPLACE(size, ' ', ''))`);
        params.size = sizes;
      }
    }

    if (minPrice !== null) {
      whereClauses.push(`price >= :minPrice`);
      params.minPrice = minPrice;
    }
    if (maxPrice !== null) {
      whereClauses.push(`price <= :maxPrice`);
      params.maxPrice = maxPrice;
    }

    const whereSQL =
      whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : "";

    let data;

    if (!userId) {
      data = await query<Product[]>(
        `SELECT p.*,
        COALESCE(s.discount_type, NULL) AS discount_type, COALESCE(s.discount_value, NULL) AS discount_value 
        FROM products as p LEFT JOIN on_sale as s ON p.id = s.product_id 
        AND NOW() BETWEEN s.sale_from AND s.sale_to AND s.status = 'active'
        ${whereSQL} ORDER BY ${sortBy} ${order} LIMIT :limit OFFSET :offset`,
        params
      );
    } else {
      params.userId = userId;

      data = await query<Product[]>(
        `SELECT p.*,
        case when f.id is not null then 1 else 0 end as is_liked,
        COALESCE(JSON_ARRAYAGG(JSON_OBJECT('comment', pc.comment)), JSON_ARRAY()) AS comments,
        MAX(s.discount_type) AS discount_type, MAX(s.discount_value) AS discount_value
        FROM products as p LEFT JOIN on_sale as s ON p.id = s.product_id 
        AND NOW() BETWEEN s.sale_from AND s.sale_to AND s.status = 'active'
        left join favouriteProducts f on p.id = f.productId and f.userId = :userId
        LEFT JOIN productComments pc ON p.id = pc.productId AND pc.userId = :userId
        ${whereSQL} GROUP BY p.id ORDER BY ${sortBy} ${order} LIMIT :limit OFFSET :offset`,
        params
      );
    }

    if (data.length === 0) {
      return res
        .status(200)
        .json({ page, limit, total: 0, totalPages: 1, data: [] });
    }

    const totalResult = await query<any[]>(
      `SELECT COUNT(*) as count FROM products ${whereSQL}`,
      params
    );
    const total = (totalResult[0] as { count: number }).count;
    const totalPages = Math.ceil(total / limit);

    const finalColors = data
      .filter((item: any) => item.color)
      .map((item: any) => item.color.split(", "));
    const finalSizes = data
      .filter((item: any) => item.size)
      .map((item: any) => item.size.split(", "));

    res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      data: data.map((item: any, index) => ({
        ...item,
        color: finalColors[index],
        size: finalSizes[index],
        comments: data[index].comments[0].comment ? data[index].comments : [],
      })),
      hasMore: fetchType === "scroll" ? offset + limit < total : false,
    });
  } catch (err: any) {
    if (res.status) {
      res.status(500).json({ message: err.message });
    } else {
      throw new Error(err.message);
    }
  }
});

sneakersRouter.get(
  "/product/:id",
  optionalAuth as any,
  async (req: any, res: any) => {
    try {
      const id = parseInt(req.params.id as string);
      const userId = req.user?.userId ?? null;

      let data;
      let inCartProducts;
      let comments;

      if (!userId) {
        data = await query<Product[]>(
          `SELECT p.*,
            COALESCE(s.discount_type, NULL) AS discount_type, COALESCE(s.discount_value, NULL) AS discount_value, COALESCE(s.sale_to, null) as sale_to, COALESCE(s.sale_from, null) as sale_from 
            FROM products as p
            LEFT JOIN on_sale as s ON p.id = s.product_id
            AND NOW() BETWEEN s.sale_from AND s.sale_to AND s.status = 'active'
            WHERE p.id = :id`,
          {
            id,
          }
        );
      } else {
        data = await query<Product[]>(
          `SELECT p.*,
            case when f.id is not null then 1 else 0 end as is_liked,
            COALESCE(s.discount_type, NULL) as discount_type, COALESCE(s.discount_value, NULL) as discount_value, COALESCE(s.sale_to, null) as sale_to, COALESCE(s.sale_from, null) as sale_from,
            rp.rating as ratedByUser
            FROM products as p
            LEFT JOIN on_sale as s ON p.id = s.product_id
            AND NOW() BETWEEN s.sale_from AND s.sale_to AND s.status = 'active'
            left join favouriteProducts f on p.id = f.productId and f.userId = :userId
            left join ratedProducts rp on p.id = rp.productId and rp.userId = :userId
            WHERE p.id = :id`,
          {
            id,
            userId,
          }
        );

        inCartProducts = await query(
          `SELECT size, color, quantity FROM inCartProducts WHERE productId = :productId and userId = :userId`,
          {
            productId: id,
            userId,
          }
        );

        comments = await query(
          `SELECT id, comment FROM productComments WHERE productId = :productId AND userId = :userId`,
          {
            productId: id,
            userId,
          }
        );
      }

      if (data.length <= 0) {
        return res.status(404).json({ message: "no data found" });
      }

      const finalColors = data[0].color.split(", ");
      const finalSizes = data[0].size.split(", ");

      res.status(200).json({
        ...data[0],
        color: finalColors,
        size: finalSizes,
        inCartProducts,
        comments,
      });
    } catch (err: any) {
      if (res.status) {
        res.status(500).json({ message: err.message });
      } else {
        throw new Error(err.message);
      }
    }
  }
);

sneakersRouter.get("/trending", async (req: any, res: any) => {
  try {
    const data = await query<Trending[]>("SELECT * FROM trending");

    if (data.length <= 0) {
      res.status(404).json({ message: "no data found" });
    }

    res.status(200).json(data);
  } catch (err: any) {
    if (res.status) {
      res.status(500).json({ message: err.message });
    } else {
      throw new Error(err.message);
    }
  }
});

sneakersRouter.get("/testimonials", async (req: any, res: any) => {
  try {
    const data = await query<Testimonial[]>("SELECT * FROM testimonials");

    if (data.length <= 0) {
      return res.status(404).json({ message: "no data found" });
    }

    return res.status(200).json(data);
  } catch (err: any) {
    if (res.status) {
      return res.status(500).json({ message: err.message });
    } else {
      throw new Error(err.message);
    }
  }
});

sneakersRouter.get(
  "/products/cart",
  requireAuth as any,
  async (req: any, res: any) => {
    try {
      const userId = req.user?.userId;

      const data = await getInCartProducts(userId);
      const updatedData = data.map((item) => {
        const {
          inCartId,
          cartProductCreatedAt,
          quantity,
          selectedSize,
          selectedColor,
          ...rest
        } = item;
        return {
          id: inCartId,
          createdAt: cartProductCreatedAt,
          quantity,
          size: selectedSize,
          color: selectedColor,
          product: rest,
        };
      });

      return res.status(200).json(updatedData);
    } catch (err: any) {
      if (res.status) {
        res.status(500).json({ message: err.message });
      } else {
        throw new Error(err.message);
      }
    }
  }
);

sneakersRouter.post(
  "/product/like",
  requireAuth as any,
  async (req: any, res: any) => {
    try {
      const { id } = req.body;
      const userId = req.user?.userId;

      if (!id) {
        return res.status(400).json({ message: "invalid request" });
      }

      await LikeProduct(id, userId);

      return res.status(200).json({ message: "success" });
    } catch (err: any) {
      if (res.status) {
        res.status(500).json({ message: err.message });
      } else {
        throw new Error(err.message);
      }
    }
  }
);

sneakersRouter.post(
  "/product/unlike",
  requireAuth as any,
  async (req: any, res: any) => {
    try {
      const { id } = req.body;
      const userId = req.user?.userId;

      if (!id) {
        return res.status(400).json({ message: "invalid request" });
      }

      await UnLikeProduct(id, userId);

      res.status(200).json({ message: "success" });
    } catch (err: any) {
      if (res.status) {
        res.status(500).json({ message: err.message });
      } else {
        throw new Error(err.message);
      }
    }
  }
);

sneakersRouter.post(
  "/product/likeUnlike",
  requireAuth as any,
  async (req: any, res: any) => {
    try {
      const { id } = req.body;
      const userId = req.user?.userId;

      if (!id) {
        return res.status(400).json({ message: "invalid request" });
      }

      const rows = await checkIfUserLikedProduct(id, userId);

      if (rows.length > 0) {
        await UnLikeProduct(id, userId);
      } else {
        await LikeProduct(id, userId);
      }

      return res
        .status(200)
        .json({ message: rows.length > 0 ? "unliked" : "liked" });
    } catch (err: any) {
      if (res.status) {
        res.status(500).json({ message: err.message });
      } else {
        throw new Error(err.message);
      }
    }
  }
);

sneakersRouter.post(
  "/product/addtocart",
  requireAuth as any,
  async (req: any, res: any) => {
    try {
      const { id: productId, quantity, size, color } = req.body;
      const userId = req.user?.userId;

      if (!productId || !size || !color) {
        return res.status(400).json({ message: "invalid request" });
      }

      await AddToCart(productId, userId, quantity, size, color);

      return res.status(200).json({ message: "success" });
    } catch (err: any) {
      if (res.status) {
        res.status(500).json({ message: err.message });
      } else {
        throw new Error(err.message);
      }
    }
  }
);

sneakersRouter.post("/product/rate", async (req: any, res: any) => {
  try {
    const { id, userId, rating } = req.body;

    if (!id || !userId || !rating) {
      return res.status(400).json({ message: "invalid request" });
    }

    await calcProductRating(id, userId, rating);

    await RateProduct(id, userId, rating);

    return res.status(200).json({ message: "success" });
  } catch (err: any) {
    if (res.status) {
      res.status(500).json({ message: err.message });
    } else {
      throw new Error(err.message);
    }
  }
});

sneakersRouter.post("/product/comment", async (req: any, res: any) => {
  try {
    const { id, userId, comment } = req.body;

    if (!id || !userId || !comment) {
      return res.status(400).json({ message: "invalid request" });
    }
    await commentAboutProduct(id, userId, comment);

    return res.status(200).json({ message: "success" });
  } catch (err: any) {
    if (res.status) {
      res.status(500).json({ message: err.message });
    } else {
      throw new Error(err.message);
    }
  }
});
sneakersRouter.post(
  "/placeOrder",
  requireAuth as any,
  async (req: any, res: any) => {
    try {
      const {
        name,
        phoneNumber,
        address,
        selectedMethod,
        cardholderName,
        cardNumber,
        expiryDate,
        cvv,
        cartItems,
      } = req.body;

      if (
        !name ||
        !phoneNumber ||
        !address ||
        !selectedMethod ||
        !cardholderName ||
        !cardNumber ||
        !expiryDate ||
        !cvv ||
        !cartItems
      ) {
        return res.status(400).json({ message: "invalid request" });
      }

      const userId = req.user?.userId;

      await placeAnOrder(
        userId,
        name,
        phoneNumber,
        address,
        selectedMethod,
        cardholderName,
        cardNumber,
        expiryDate,
        cvv,
        cartItems
      );

      return res.status(200).json({ message: "success" });
    } catch (err: any) {
      if (res.status) {
        res.status(500).json({ message: err.message });
      } else {
        throw new Error(err.message);
      }
    }
  }
);

sneakersRouter.delete(
  "/product/comment/:id",
  requireAuth as any,
  async (req: any, res: any) => {
    try {
      const id = parseInt(req.params.id as string);

      if (!id) {
        return res.status(400).json({ message: "invalid request" });
      }
      await deleteComment(id);

      return res.status(200).json({ message: "success" });
    } catch (err: any) {
      if (res.status) {
        res.status(500).json({ message: err.message });
      } else {
        throw new Error(err.message);
      }
    }
  }
);

export default sneakersRouter;
