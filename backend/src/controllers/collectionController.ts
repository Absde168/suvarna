import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { productListSelect } from "./productController.js";

export async function getCollections(_req: Request, res: Response) {
  const collections = await prisma.collection.findMany({
    include: { _count: { select: { products: true } }, image: { select: { id: true } } },
    orderBy: [{ position: 'asc' }, { id: 'desc' }],
  });

  res.json(
    collections.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      position: c.position,
      hasImage: !!c.image,
      count: c._count.products,
    }))
  );
}

export async function reorderCollections(req: Request, res: Response) {
  const { order } = req.body as { order: number[] };
  if (!Array.isArray(order)) {
    return res.status(400).json({ error: "order must be an array of collection ids" });
  }

  await Promise.all(
    order.map((id, index) =>
      prisma.collection.update({ where: { id }, data: { position: index } })
    )
  );

  res.json({ ok: true });
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
