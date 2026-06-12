import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  admin?: { username: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { username: string };
    req.admin = { username: payload.username };
    next();
  } catch {
    return res.status(401).json({ error: "Недействительный или истёкший токен" });
  }
}
