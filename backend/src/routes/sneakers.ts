import express from "express";
import { createPool } from "../db/mysql";
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

export default sneakersRouter;
