import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Введите логин и пароль" });
  }

  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: "12h" });

  res.json({ token, username });
}
