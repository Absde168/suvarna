import type { Request, Response } from "express";
import sharp from "sharp";
import { prisma } from "../prisma.js";

const ALLOWED_WIDTHS = [400, 600, 800, 1200, 1600];

async function sendImage(res: Response, image: { data: Uint8Array; mimeType: string }, width: number) {
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

  if (ALLOWED_WIDTHS.includes(width)) {
    const resized = await sharp(Buffer.from(image.data))
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality: 78 })
      .toBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    return res.send(resized);
  }

  res.setHeader("Content-Type", image.mimeType);
  res.send(Buffer.from(image.data));
}

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

  await sendImage(res, image, Number(req.query.w));
}

export async function getCollectionImageById(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  const image = await prisma.collectionImage.findUnique({
    where: { collectionId: id },
    select: { data: true, mimeType: true },
  });

  if (!image) {
    return res.status(404).json({ error: "Изображение не найдено" });
  }

  await sendImage(res, image, Number(req.query.w));
}
