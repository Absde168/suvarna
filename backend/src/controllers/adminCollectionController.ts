import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getAdminCollections(_req: Request, res: Response) {
  const collections = await prisma.collection.findMany({
    include: { _count: { select: { products: true } }, image: { select: { id: true } } },
    orderBy: { id: "asc" },
  });

  res.json(
    collections.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      hasImage: !!c.image,
      count: c._count.products,
    }))
  );
}

export async function createAdminCollection(req: Request, res: Response) {
  const { name, slug, description } = req.body as { name?: string; slug?: string; description?: string };

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Укажите название коллекции" });
  }

  const finalSlug = slug?.trim() ? slugify(slug) : slugify(name);
  if (!finalSlug) {
    return res.status(400).json({ error: "Некорректный slug" });
  }

  const existing = await prisma.collection.findUnique({ where: { slug: finalSlug } });
  if (existing) {
    return res.status(409).json({ error: "Коллекция с таким slug уже существует" });
  }

  const collection = await prisma.collection.create({
    data: { name: name.trim(), slug: finalSlug, description: description?.trim() || null },
  });

  res.status(201).json({ ...collection, hasImage: false, count: 0 });
}

export async function updateAdminCollection(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  const { name, slug, description } = req.body as { name?: string; slug?: string; description?: string };

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Укажите название коллекции" });
  }

  const finalSlug = slug?.trim() ? slugify(slug) : slugify(name);
  if (!finalSlug) {
    return res.status(400).json({ error: "Некорректный slug" });
  }

  const existing = await prisma.collection.findUnique({ where: { slug: finalSlug } });
  if (existing && existing.id !== id) {
    return res.status(409).json({ error: "Коллекция с таким slug уже существует" });
  }

  try {
    const collection = await prisma.collection.update({
      where: { id },
      data: { name: name.trim(), slug: finalSlug, description: description?.trim() || null },
      include: { _count: { select: { products: true } }, image: { select: { id: true } } },
    });
    res.json({
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      hasImage: !!collection.image,
      count: collection._count.products,
    });
  } catch {
    res.status(404).json({ error: "Коллекция не найдена" });
  }
}

export async function deleteAdminCollection(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  try {
    await prisma.collection.delete({ where: { id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "Коллекция не найдена" });
  }
}

export async function setCollectionImage(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "Файл не передан" });
  }

  const collection = await prisma.collection.findUnique({ where: { id } });
  if (!collection) {
    return res.status(404).json({ error: "Коллекция не найдена" });
  }

  await prisma.collectionImage.upsert({
    where: { collectionId: id },
    create: { collectionId: id, data: new Uint8Array(req.file.buffer), mimeType: req.file.mimetype },
    update: { data: new Uint8Array(req.file.buffer), mimeType: req.file.mimetype },
  });

  res.status(201).json({ hasImage: true });
}

export async function deleteCollectionImage(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  try {
    await prisma.collectionImage.delete({ where: { collectionId: id } });
  } catch {
    // изображения и не было
  }

  res.status(204).end();
}
