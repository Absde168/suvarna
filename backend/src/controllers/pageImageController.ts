import { Request, Response } from "express";
import sharp from "sharp";
import multer from "multer";
import { prisma } from "../prisma.js";

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

export async function getPageImage(req: Request, res: Response) {
  const { key } = req.params;
  const w = req.query.w ? parseInt(req.query.w as string) : undefined;

  const img = await prisma.pageImage.findUnique({ where: { key } });
  if (!img) return res.status(404).json({ error: "Not found" });

  let buf = Buffer.from(img.data as any);
  if (w) buf = await sharp(buf).resize(w, undefined, { withoutEnlargement: true }).toBuffer();

  res.set("Content-Type", img.mimeType);
  res.set("Cache-Control", "public, max-age=86400");
  res.send(buf);
}

export async function setPageImage(req: Request, res: Response) {
  const { key } = req.params;
  if (!req.file) return res.status(400).json({ error: "No file" });

  const data = req.file.buffer as any;
  const mimeType = req.file.mimetype;

  await prisma.pageImage.upsert({
    where: { key },
    create: { key, data, mimeType },
    update: { data, mimeType },
  });

  res.json({ ok: true });
}

export async function deletePageImage(req: Request, res: Response) {
  const { key } = req.params;
  await prisma.pageImage.deleteMany({ where: { key } });
  res.json({ ok: true });
}

export async function listPageImages(_req: Request, res: Response) {
  const imgs = await prisma.pageImage.findMany({ select: { key: true } });
  res.json(imgs.map((img) => img.key));
}
