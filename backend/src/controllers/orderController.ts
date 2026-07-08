import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { randomUUID } from "crypto";
import { createDolyameOrder, dolyameConfigured } from "../dolyame/client.js";

const YOKASSA_SHOP_ID = process.env.YOKASSA_SHOP_ID!;
const YOKASSA_SECRET_KEY = process.env.YOKASSA_SECRET_KEY!;
const APP_URL = process.env.APP_URL || "https://iamsuvarna.ru";

const DELIVERY_PRICES: Record<string, number> = {
  courier: 500,
  pickup: 0,
  cdek: 350,
  post: 350,
};

const ONLINE_METHODS = new Set(["card", "sbp"]);

const YOKASSA_METHOD_MAP: Record<string, string> = {
  card: "bank_card",
  sbp: "sbp",
};

async function createYokassaPayment(params: {
  amount: number;
  orderId: number;
  paymentMethod: string;
  customerEmail: string;
}): Promise<{ yokassaId: string; confirmationUrl: string }> {
  const idempotenceKey = randomUUID();
  const credentials = Buffer.from(`${YOKASSA_SHOP_ID}:${YOKASSA_SECRET_KEY}`).toString("base64");

  const body = {
    amount: {
      value: params.amount.toFixed(2),
      currency: "RUB",
    },
    confirmation: {
      type: "redirect",
      return_url: `${APP_URL}/payment/return?orderId=${params.orderId}`,
    },
    capture: true,
    description: `Заказ №${params.orderId}`,
    payment_method_type: YOKASSA_METHOD_MAP[params.paymentMethod] ?? "bank_card",
    receipt: {
      customer: { email: params.customerEmail },
      items: [
        {
          description: `Заказ №${params.orderId}`,
          quantity: "1.00",
          amount: {
            value: params.amount.toFixed(2),
            currency: "RUB",
          },
          vat_code: 1,
          payment_subject: "commodity",
          payment_mode: "full_payment",
        },
      ],
    },
  };

  const response = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
      "Idempotence-Key": idempotenceKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ЮKасса error ${response.status}: ${err}`);
  }

  const data = await response.json() as any;
  return {
    yokassaId: data.id,
    confirmationUrl: data.confirmation.confirmation_url,
  };
}

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
    select: { id: true, price: true, name: true },
  });
  const priceByProductId = new Map(products.map((p) => [p.id, p.price]));
  const nameByProductId = new Map(products.map((p) => [p.id, p.name]));

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

  if (ONLINE_METHODS.has(paymentMethod)) {
    try {
      const { yokassaId, confirmationUrl } = await createYokassaPayment({
        amount: totalPrice,
        orderId: order.id,
        paymentMethod,
        customerEmail: email,
      });

      await prisma.payment.update({
        where: { orderId: order.id },
        data: { providerId: yokassaId },
      });

      return res.status(201).json({ ...order, confirmationUrl });
    } catch (err) {
      console.error("ЮKасса payment creation failed:", err);
      return res.status(201).json(order);
    }
  }

  if (paymentMethod === "dolyame" && dolyameConfigured()) {
    try {
      // Позиции для «Долями»: товары + строка доставки, чтобы сумма позиций
      // совпадала с amount (иначе API отклонит заявку).
      const dolyameItems = items.map((item: { productId: number; quantity: number }) => ({
        name: nameByProductId.get(item.productId) ?? `Товар ${item.productId}`,
        quantity: item.quantity,
        price: priceByProductId.get(item.productId)!,
      }));
      if (deliveryPrice > 0) {
        dolyameItems.push({ name: "Доставка", quantity: 1, price: deliveryPrice });
      }

      const { link } = await createDolyameOrder({
        orderId: order.id,
        amount: totalPrice,
        items: dolyameItems,
        client: { firstName, lastName, phone, email },
      });

      return res.status(201).json({ ...order, confirmationUrl: link });
    } catch (err) {
      console.error("Долями order creation failed:", err);
      return res.status(201).json(order);
    }
  }

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
