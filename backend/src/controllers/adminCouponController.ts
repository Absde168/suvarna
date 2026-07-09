import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

export async function listAdminCoupons(_req: Request, res: Response) {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { id: true, name: true } },
      product: { select: { id: true, name: true } },
    },
  });
  res.json(coupons);
}

export async function createAdminCoupon(req: Request, res: Response) {
  const { code, percent, categoryId, productId } = req.body as {
    code?: string;
    percent?: number;
    categoryId?: number | null;
    productId?: number | null;
  };

  if (!code?.trim()) return res.status(400).json({ error: "Введите код купона" });

  const pct = Number(percent);
  if (!Number.isInteger(pct) || pct < 1 || pct > 99) {
    return res.status(400).json({ error: "Процент должен быть от 1 до 99" });
  }

  const hasCategory = categoryId != null;
  const hasProduct = productId != null;
  if (hasCategory === hasProduct) {
    return res.status(400).json({ error: "Выберите либо категорию, либо товар" });
  }

  const existing = await prisma.coupon.findUnique({ where: { code: code.trim() } });
  if (existing) return res.status(409).json({ error: "Купон с таким кодом уже существует" });

  const coupon = await prisma.coupon.create({
    data: {
      code: code.trim(),
      percent: pct,
      categoryId: hasCategory ? Number(categoryId) : null,
      productId: hasProduct ? Number(productId) : null,
    },
    include: {
      category: { select: { id: true, name: true } },
      product: { select: { id: true, name: true } },
    },
  });
  res.status(201).json(coupon);
}

export async function toggleAdminCoupon(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Неверный id" });
  const { active } = req.body as { active?: boolean };

  const coupon = await prisma.coupon.update({
    where: { id },
    data: { active: Boolean(active) },
  });
  res.json(coupon);
}

export async function deleteAdminCoupon(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Неверный id" });
  await prisma.coupon.delete({ where: { id } });
  res.status(204).end();
}
