import express from "express";
import { createPool } from "../db/mysql";
import { RowDataPacket, FieldPacket } from "mysql2";
import { query } from "../middlewares/helper";
import { Product, Trending, Testimonial } from "../types/snaekers";
const pool = createPool();

const sneakersRouter = express.Router();

sneakersRouter.get("/", async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = (page - 1) * limit;

    const data = await query<Product[]>(
      "SELECT * FROM products LIMIT :limit OFFSET :offset",
      {
        limit: limit,
        offset: offset,
      }
    );

    if (data.length <= 0) {
      return res.status(404).json({ message: "no data found" });
    }

    const totalResult = await query<any[]>(
      "SELECT COUNT(*) as count FROM products"
    );
    const total = (totalResult[0] as { count: number }).count;
    const totalPages = Math.ceil(total / limit);

    if (data.length === 0) {
      return res.status(404).json({ message: "no data found" });
    }

    const colors = data[0].color.split(", ");
    const sizes = data[0].size.split(", ");

    res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      data: data.map((item: any) => ({
        ...item,
        color: colors,
        size: sizes,
      })),
    });
  } catch (err: any) {
    if (res.status) {
      res.status(500).json({ message: err.message });
    } else {
      throw new Error(err.message);
    }
  }
});

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

export default sneakersRouter;
