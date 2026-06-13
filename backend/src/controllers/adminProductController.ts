import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { Prisma } from "@prisma/client";

const adminProductSelect = {
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
  collection: { select: { id: true, name: true, slug: true } },
  images: {
    select: { id: true, position: true, mimeType: true },
    orderBy: { position: "asc" as const },
  },
  createdAt: true,
  updatedAt: true,
} as const;

const SORTABLE_FIELDS = ["name", "article", "price", "quantity", "createdAt"] as const;
type SortableField = (typeof SORTABLE_FIELDS)[number];

export async function getAdminProducts(req: Request, res: Response) {
  const {
    page = "1",
    pageSize = "20",
    search,
    category,
    inStock,
    isNew,
    isBestseller,
    sortBy = "createdAt",
    sortDir = "desc",
  } = req.query;

  const pageNum = Math.max(1, Number(page) || 1);
  const pageSizeNum = Math.min(100, Math.max(1, Number(pageSize) || 20));

  const where: Prisma.ProductWhereInput = {};

  if (search && String(search).trim()) {
    const term = String(search).trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { article: { contains: term, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = { slug: String(category) };
  }

  if (inStock !== undefined) {
    where.inStock = inStock === "true";
  }

  if (isNew !== undefined) {
    where.isNew = isNew === "true";
  }

  if (isBestseller !== undefined) {
    where.isBestseller = isBestseller === "true";
  }

  const sortField: SortableField = SORTABLE_FIELDS.includes(sortBy as SortableField)
    ? (sortBy as SortableField)
    : "createdAt";
  const sortDirection: Prisma.SortOrder = sortDir === "asc" ? "asc" : "desc";

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: adminProductSelect,
      orderBy: { [sortField]: sortDirection },
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({ items, total, page: pageNum, pageSize: pageSizeNum });
}

export async function getAdminProductById(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: adminProductSelect,
  });

  if (!product) {
    return res.status(404).json({ error: "Товар не найден" });
  }

  res.json(product);
}

interface ProductInput {
  name: string;
  article: string;
  price: number;
  quantity: number;
  sizes: string[];
  colors: string[];
  description?: string | null;
  fabric?: string | null;
  care?: string | null;
  isNew?: boolean;
  isBestseller?: boolean;
  inStock?: boolean;
  categoryId?: number | null;
  collectionId?: number | null;
}

function buildProductData(body: ProductInput): Prisma.ProductUncheckedCreateInput {
  return {
    name: body.name,
    article: body.article,
    price: Number(body.price),
    quantity: Number(body.quantity ?? 0),
    sizes: Array.isArray(body.sizes) ? body.sizes : [],
    colors: Array.isArray(body.colors) ? body.colors : [],
    description: body.description ?? null,
    fabric: body.fabric ?? null,
    care: body.care ?? null,
    isNew: Boolean(body.isNew),
    isBestseller: Boolean(body.isBestseller),
    inStock: body.inStock ?? true,
    categoryId: body.categoryId ?? null,
    collectionId: body.collectionId ?? null,
  };
}

export async function createAdminProduct(req: Request, res: Response) {
  const body = req.body as ProductInput;

  if (!body.name || !body.article || body.price === undefined) {
    return res.status(400).json({ error: "Заполните название, артикул и цену" });
  }

  const existing = await prisma.product.findUnique({ where: { article: body.article } });
  if (existing) {
    return res.status(409).json({ error: "Товар с таким артикулом уже существует" });
  }

  const product = await prisma.product.create({
    data: buildProductData(body),
    select: adminProductSelect,
  });

  res.status(201).json(product);
}

export async function updateAdminProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  const body = req.body as ProductInput;

  if (!body.name || !body.article || body.price === undefined) {
    return res.status(400).json({ error: "Заполните название, артикул и цену" });
  }

  const existing = await prisma.product.findUnique({ where: { article: body.article } });
  if (existing && existing.id !== id) {
    return res.status(409).json({ error: "Товар с таким артикулом уже существует" });
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: buildProductData(body),
      select: adminProductSelect,
    });
    res.json(product);
  } catch {
    res.status(404).json({ error: "Товар не найден" });
  }
}

export async function deleteAdminProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  try {
    await prisma.product.delete({ where: { id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "Товар не найден" });
  }
}

export async function addProductImage(req: Request, res: Response) {
  const productId = Number(req.params.id);
  if (Number.isNaN(productId)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "Файл изображения не передан" });
  }

  const maxPosition = await prisma.productImage.aggregate({
    where: { productId },
    _max: { position: true },
  });

  const image = await prisma.productImage.create({
    data: {
      productId,
      data: new Uint8Array(file.buffer),
      mimeType: file.mimetype,
      position: (maxPosition._max.position ?? -1) + 1,
    },
    select: { id: true, position: true, mimeType: true },
  });

  res.status(201).json(image);
}

export async function deleteProductImage(req: Request, res: Response) {
  const imageId = Number(req.params.imageId);
  if (Number.isNaN(imageId)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  try {
    await prisma.productImage.delete({ where: { id: imageId } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "Изображение не найдено" });
  }
}

export async function reorderProductImages(req: Request, res: Response) {
  const productId = Number(req.params.id);
  if (Number.isNaN(productId)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  const { order } = req.body as { order: number[] };
  if (!Array.isArray(order)) {
    return res.status(400).json({ error: "Некорректный формат данных" });
  }

  await prisma.$transaction(
    order.map((imageId, index) =>
      prisma.productImage.update({
        where: { id: imageId },
        data: { position: index },
      })
    )
  );

  const images = await prisma.productImage.findMany({
    where: { productId },
    select: { id: true, position: true, mimeType: true },
    orderBy: { position: "asc" },
  });

  res.json(images);
}
