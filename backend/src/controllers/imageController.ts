import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

export async function getImageById(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  const image = await prisma.productImage.findUnique({
    where: { id },
    select: { data: true, mimeType: true },
  });

  if (!image) {
    return res.status(404).json({ error: "Изображение не найдено" });
  }

  res.setHeader("Content-Type", image.mimeType);
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.send(Buffer.from(image.data));
}
