import express from "express";
import { requireAuth, AuthRequest } from "../middlewares/auth";
import * as UserModel from "../models/user";

const userRouter = express.Router();

userRouter.get(
  "/me",
  requireAuth as any,
  async (req: AuthRequest, res: any) => {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await UserModel.findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Do not send password_hash
    const { password_hash, ...safe } = user;
    return res.json({ user: safe });
  }
);

userRouter.put(
  "/update",
  requireAuth as any,
  async (req: AuthRequest, res: any) => {
    const userId = req.user?.userId;
    const { name } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!name) return res.status(400).json({ message: "Name is required" });

    await UserModel.updateUser(userId, name);

    const user = await UserModel.findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Do not send password_hash
    const { password_hash, ...safe } = user;
    return res.json({ user: { ...safe, name: name } });
  }
);

export default userRouter;
