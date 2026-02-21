import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  userId?: number;
}

async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Not authorised" });
  }
  const Access_Token = process.env.ACCESS_TOKEN;
  if (!Access_Token) {
    return res.status(500).json({ message: " TOKEN SECRET NOT PRESENT" });
  }
  try {
    const decode = jwt.verify(token, Access_Token) as { id: number };
    req.userId = decode.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session Expired" });
  }
}

export default authMiddleware;
