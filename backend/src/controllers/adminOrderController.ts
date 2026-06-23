import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { Prisma } from "@prisma/client";

const adminOrderSelect = {
  id: true,
  firstName: true,
  lastName: true,
  phone: true,
  email: true,
  deliveryMethod: true,
  city: true,
  address: true,
  apartment: true,
  comment: true,
  status: true,
  totalPrice: true,
  createdAt: true,
  items: {
    select: {
      id: true,
      productId: true,
      size: true,
      quantity: true,
      price: true,
      product: { select: { id: true, name: true, article: true } },
    },
  },
  payment: {
    select: { id: true, method: true, status: true, amount: true, currency: true, paidAt: true },
  },
} as const;

const SORTABLE_FIELDS = ["createdAt", "totalPrice", "status"] as const;
type SortableField = (typeof SORTABLE_FIELDS)[number];

export const ORDER_STATUSES = ["new", "processing", "shipped", "completed", "cancelled"] as const;

export async function getAdminOrders(req: Request, res: Response) {
  const {
    page = "1",
    pageSize = "20",
    search,
    status,
    sortBy = "createdAt",
    sortDir = "desc",
  } = req.query;

  const pageNum = Math.max(1, Number(page) || 1);
  const pageSizeNum = Math.min(100, Math.max(1, Number(pageSize) || 20));

  const where: Prisma.OrderWhereInput = {};

  if (search && String(search).trim()) {
    const term = String(search).trim();
    where.OR = [
      { firstName: { contains: term, mode: "insensitive" } },
      { lastName: { contains: term, mode: "insensitive" } },
      { phone: { contains: term, mode: "insensitive" } },
      { email: { contains: term, mode: "insensitive" } },
    ];
  }

  if (status) {
    where.status = String(status);
  }

  const sortField: SortableField = SORTABLE_FIELDS.includes(sortBy as SortableField)
    ? (sortBy as SortableField)
    : "createdAt";
  const sortDirection: Prisma.SortOrder = sortDir === "asc" ? "asc" : "desc";

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      select: adminOrderSelect,
      orderBy: { [sortField]: sortDirection },
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum,
    }),
    prisma.order.count({ where }),
  ]);

  res.json({ items, total, page: pageNum, pageSize: pageSizeNum });
}

export async function getAdminOrderById(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  const order = await prisma.order.findUnique({ where: { id }, select: adminOrderSelect });
  if (!order) {
    return res.status(404).json({ error: "Заказ не найден" });
  }

  res.json(order);
}

export async function updateAdminOrderStatus(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  const { status } = req.body as { status: string };
  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
    return res.status(400).json({ error: "Некорректный статус" });
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      select: adminOrderSelect,
    });
    res.json(order);
  } catch {
    res.status(404).json({ error: "Заказ не найден" });
  }
}

export async function deleteAdminOrder(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  try {
    await prisma.order.delete({ where: { id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "Заказ не найден" });
  }
}
