import express from "express";
import { createPool } from "../db/mysql";
import { RowDataPacket, FieldPacket } from "mysql2";
import { query } from '../middlewares/helper';
import { Product, Trending } from "../types/snaekers";
const pool = createPool();

const sneakersRouter = express.Router();

sneakersRouter.get("/", async (req: any, res: any) => {
  try {
    const [data] = await pool.query("SELECT * FROM products");

    res.status(200).json(data);
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
    const data = await query<Trending[]>(
      "SELECT * FROM trending"
    );

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

export default sneakersRouter;
