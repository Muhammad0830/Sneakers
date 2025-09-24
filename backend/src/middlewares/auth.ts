import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: any;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = req.headers.authorization;
    if (!auth)
      return res.status(401).json({ message: "Missing Authorization header" });
    const token = auth.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Missing token" });
    const payload = verifyAccessToken(token) as any;
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      req.user = null; // guest
      return next();
    }

    const token = auth.split(" ")[1];
    if (!token) {
      req.user = null; // guest
      return next();
    }

    const payload = verifyAccessToken(token) as any;
    req.user = payload; // logged-in user
    next();
  } catch (err) {
    req.user = null; // invalid/expired token → treat as guest
    next();
  }
}
