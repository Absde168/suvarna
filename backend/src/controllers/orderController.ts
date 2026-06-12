import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

const DELIVERY_PRICES: Record<string, number> = {
  courier: 500,
  pickup: 0,
  cdek: 350,
  post: 350,
};

const orderSelect = {
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
    select: { id: true, productId: true, size: true, quantity: true, price: true },
  },
  payment: {
    select: { id: true, method: true, status: true, amount: true, currency: true },
  },
} as const;

export async function createOrder(req: Request, res: Response) {
  const {
    firstName, lastName, phone, email,
    deliveryMethod, city, address, apartment, comment,
    paymentMethod, items,
  } = req.body;

  if (!firstName || !lastName || !phone || !email || !deliveryMethod || !paymentMethod) {
    return res.status(400).json({ error: "Заполните все обязательные поля" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Корзина пуста" });
  }

  const deliveryPrice = DELIVERY_PRICES[deliveryMethod] ?? 0;

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i: { productId: number }) => i.productId) } },
    select: { id: true, price: true },
  });
  const priceByProductId = new Map(products.map((p) => [p.id, p.price]));

  for (const item of items) {
    if (!priceByProductId.has(item.productId)) {
      return res.status(400).json({ error: `Товар ${item.productId} не найден` });
    }
  }

  const itemsTotal = items.reduce(
    (sum: number, item: { productId: number; quantity: number }) =>
      sum + priceByProductId.get(item.productId)! * item.quantity,
    0
  );
  const totalPrice = itemsTotal + deliveryPrice;

  const order = await prisma.order.create({
    data: {
      firstName, lastName, phone, email,
      deliveryMethod, city, address, apartment, comment,
      totalPrice,
      items: {
        create: items.map((item: { productId: number; size: string; quantity: number }) => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
          price: priceByProductId.get(item.productId)!,
        })),
      },
      payment: {
        create: {
          method: paymentMethod,
          amount: totalPrice,
        },
      },
    },
    select: orderSelect,
  });

  res.status(201).json(order);
}

export async function getOrderById(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Некорректный id" });
  }

  const order = await prisma.order.findUnique({ where: { id }, select: orderSelect });
  if (!order) {
    return res.status(404).json({ error: "Заказ не найден" });
  }

  res.json(order);
}
