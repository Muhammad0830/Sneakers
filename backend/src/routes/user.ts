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

export default userRouter;
