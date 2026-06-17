import type { Request, Response } from "express";
import sharp from "sharp";
import { prisma } from "../prisma.js";

const slideSelect = {
  id: true,
  title: true,
  label: true,
  subtitle: true,
  cta: true,
  href: true,
  align: true,
  position: true,
  image: { select: { id: true } },
} as const;

export async function getHeroSlides(_req: Request, res: Response) {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { position: "asc" },
    select: slideSelect,
  });
  res.json(slides);
}

export async function getHeroSlideImage(req: Request, res: Response) {
  const slideId = Number(req.params.id);
  if (Number.isNaN(slideId)) return res.status(400).json({ error: "Некорректный id" });

  const image = await prisma.heroSlideImage.findUnique({
    where: { slideId },
    select: { data: true, mimeType: true },
  });
  if (!image) return res.status(404).json({ error: "Изображение не найдено" });

  const w = Number(req.query.w) || 1600;
  const resized = await sharp(Buffer.from(image.data))
    .resize({ width: w, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.send(resized);
}

export async function createHeroSlide(req: Request, res: Response) {
  const { title, label, subtitle, cta, href, align, position } = req.body;
  if (!title) return res.status(400).json({ error: "Укажите заголовок" });

  const slide = await prisma.heroSlide.create({
    data: { title, label, subtitle, cta, href, align, position: position ?? 0 },
    select: slideSelect,
  });
  res.status(201).json(slide);
}

export async function updateHeroSlide(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Некорректный id" });

  const { title, label, subtitle, cta, href, align, position } = req.body;
  const slide = await prisma.heroSlide.update({
    where: { id },
    data: { title, label, subtitle, cta, href, align, position },
    select: slideSelect,
  });
  res.json(slide);
}

export async function deleteHeroSlide(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Некорректный id" });

  await prisma.heroSlide.delete({ where: { id } });
  res.status(204).end();
}

export async function setHeroSlideImage(req: Request, res: Response) {
  const slideId = Number(req.params.id);
  if (Number.isNaN(slideId)) return res.status(400).json({ error: "Некорректный id" });
  if (!req.file) return res.status(400).json({ error: "Файл не загружен" });

  const data = req.file.buffer;
  const mimeType = req.file.mimetype;

  await prisma.heroSlideImage.upsert({
    where: { slideId },
    create: { slideId, data, mimeType },
    update: { data, mimeType },
  });

  res.json({ ok: true });
}

export async function deleteHeroSlideImage(req: Request, res: Response) {
  const slideId = Number(req.params.id);
  if (Number.isNaN(slideId)) return res.status(400).json({ error: "Некорректный id" });

  await prisma.heroSlideImage.deleteMany({ where: { slideId } });
  res.status(204).end();
}
