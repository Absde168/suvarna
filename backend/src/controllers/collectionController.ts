import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { productListSelect } from "./productController.js";

export async function getCollections(_req: Request, res: Response) {
  const collections = await prisma.collection.findMany({
    include: { _count: { select: { products: true } }, image: { select: { id: true } } },
    orderBy: { id: 'desc' },
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

export async function getCollectionBySlug(req: Request, res: Response) {
  const { slug } = req.params;

  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: { image: { select: { id: true } } },
  });
  if (!collection) {
    return res.status(404).json({ error: "Коллекция не найдена" });
  }

  const products = await prisma.product.findMany({
    where: { collectionId: collection.id },
    select: productListSelect,
    orderBy: { createdAt: "desc" },
  });

  res.json({
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    description: collection.description,
    hasImage: !!collection.image,
    products,
  });
}
