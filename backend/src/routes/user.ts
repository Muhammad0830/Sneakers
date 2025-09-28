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

userRouter.get(
  "/favourites",
  requireAuth as any,
  async (req: any, res: any) => {
    try {
      const userId = req.user?.userId;

      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const favourites = await UserModel.findFavourites(userId);

      return res.status(200).json({
        data: favourites.map((favourite, index) => ({
          ...favourite,
          color: favourite.color.split(", "),
          size: favourite.size.split(", "),
          is_liked: 1,
        })),
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

userRouter.get(
  "/myComments",
  requireAuth as any,
  async (req: any, res: any) => {
    try {
      const userId = req.user?.userId;

      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const commentsRows = await UserModel.findMyCommentsWithProducts(userId);

      const updatedComments = commentsRows.map((c) => {
        const { commentId, comment, commentCreatedAt, ...rest } = c;
        return {
          id: commentId,
          comment: comment,
          created_at: commentCreatedAt,
          product: rest,
        };
      });

      return res.status(200).json(updatedComments);
    } catch (err: any) {
      if (res.status) {
        res.status(500).json({ message: err.message });
      } else {
        throw new Error(err.message);
      }
    }
  }
);

userRouter.post(
  "/contactMessage",
  requireAuth as any,
  async (req: any, res: any) => {
    try {
      const { message } = req.body;
      const userId = req.user?.userId;

      if (!message)
        return res.status(400).json({ message: "Message is required" });

      await UserModel.SendMessage(message, userId);

      return res.status(200).json({ message: "Success" });
    } catch (err: any) {
      if (res.status) {
        res.status(500).json({ message: err.message });
      } else {
        throw new Error(err.message);
      }
    }
  }
);

userRouter.put(
  "/update",
  requireAuth as any,
  async (req: AuthRequest, res: any) => {
    try {
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
    } catch (err: any) {
      if (res.status) {
        res.status(500).json({ message: err.message });
      } else {
        throw new Error(err.message);
      }
    }
  }
);

userRouter.put(
  "/comment/:id",
  requireAuth as any,
  async (req: any, res: any) => {
    try {
      const { id, comment } = req.body;
      const userId = req.user?.userId;

      if (!id || !userId || !comment) {
        return res.status(400).json({ message: "invalid request" });
      }

      await UserModel.updateComment(id, userId, comment);

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

userRouter.delete(
  "/favourite/:id",
  requireAuth as any,
  async (req: any, res: any) => {
    try {
      const id = parseInt(req.params.id as string);
      const userId = req.user?.userId;

      if (!id) return res.status(400).json({ message: "Invalid request" });
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      await UserModel.deleteFavourite(id, userId);

      return res.status(200).json({ message: "Success" });
    } catch (err: any) {
      if (res.status) {
        res.status(500).json({ message: err.message });
      } else {
        throw new Error(err.message);
      }
    }
  }
);

userRouter.delete(
  "/onCartProduct/:id",
  requireAuth as any,
  async (req: any, res: any) => {
    try {
      const id = parseInt(req.params.id as string);
      const userId = req.user?.userId;

      if (!id) return res.status(400).json({ message: "Invalid request" });

      const rows = await UserModel.checkIfUserHasProduct(id, userId);
      if (rows.length <= 0)
        return res.status(404).json({ message: "Product not found" });

      await UserModel.deleteOnCartProduct(id, userId);

      return res.status(200).json({ message: "Success" });
    } catch (err: any) {
      if (res.status) {
        res.status(500).json({ message: err.message });
      } else {
        throw new Error(err.message);
      }
    }
  }
);

export default userRouter;
