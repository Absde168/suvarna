import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

const productListSelect = {
  id: true,
  name: true,
  article: true,
  price: true,
  quantity: true,
  sizes: true,
  colors: true,
  description: true,
  fabric: true,
  care: true,
  isNew: true,
  isBestseller: true,
  inStock: true,
  category: { select: { id: true, name: true, slug: true } },
  images: {
    select: { id: true, position: true, mimeType: true },
    orderBy: { position: "asc" as const },
  },
} as const;

export async function getProducts(req: Request, res: Response) {
  const { category } = req.query;

  const products = await prisma.product.findMany({
    where: category ? { category: { slug: String(category) } } : undefined,
    select: productListSelect,
    orderBy: { createdAt: "desc" },
  });

  res.json(products);
}

export async function getProductById(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: productListSelect,
  });

  if (!product) {
    return res.status(404).json({ error: "Товар не найден" });
  }

  res.json(product);
}
