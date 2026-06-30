import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-а-яё]/gi, "")
    .replace(/^-+|-+$/g, "");
}

export async function createAdminCategory(req: Request, res: Response) {
  const { name } = req.body as { name?: string };
  if (!name?.trim()) {
    return res.status(400).json({ error: "Название обязательно" });
  }
  const slug = slugify(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return res.status(409).json({ error: "Категория с таким именем уже существует" });
  }
  const category = await prisma.category.create({ data: { name: name.trim(), slug } });
  res.status(201).json(category);
}

export async function deleteAdminCategory(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Неверный id" });

  const category = await prisma.category.findUnique({ where: { id }, include: { _count: { select: { products: true } } } });
  if (!category) return res.status(404).json({ error: "Не найдено" });
  if (category._count.products > 0) {
    return res.status(409).json({ error: `Категория используется в ${category._count.products} товарах` });
  }

  await prisma.category.delete({ where: { id } });
  res.status(204).end();
}
