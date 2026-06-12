import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

export async function getCategories(_req: Request, res: Response) {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });

  res.json(
    categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: c._count.products,
    }))
  );
}
