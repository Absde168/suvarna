import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { randomUUID } from "crypto";
import { createDolyameOrder, dolyameConfigured } from "../dolyame/client.js";
import { applyCoupon } from "../coupons/apply.js";
import { sendOrderNotification } from "../mail/orderNotification.js";

const YOKASSA_SHOP_ID = process.env.YOKASSA_SHOP_ID!;
const YOKASSA_SECRET_KEY = process.env.YOKASSA_SECRET_KEY!;
const APP_URL = process.env.APP_URL || "https://iamsuvarna.ru";

const DELIVERY_PRICES: Record<string, number> = {
  courier: 600,
  pickup: 0,
  cdek: 700,
  post: 500,
};

const ONLINE_METHODS = new Set(["card", "sbp"]);
const PAYMENT_METHODS = new Set(["card", "sbp", "dolyame"]);

const YOKASSA_METHOD_MAP: Record<string, string> = {
  card: "bank_card",
  sbp: "sbp",
};

function notifyShop(order: {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  deliveryMethod: string;
  city: string | null;
  address: string | null;
  apartment: string | null;
  comment: string | null;
  totalPrice: number;
}, paymentMethod: string, items: Array<{ productId: number; size: string; quantity: number; price: number }>, names: Map<number, string>) {
  void sendOrderNotification({
    ...order,
    paymentMethod,
    items: items.map((item) => ({
      name: names.get(item.productId) ?? `Товар ${item.productId}`,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    })),
  }).catch((err) => {
    console.error(`Order notification email failed for order ${order.id}:`, err instanceof Error ? err.message : "unknown error");
  });
}

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
    paymentMethod, items, couponCode,
  } = req.body;

  // Фамилия необязательна (на форме без звёздочки) — не блокируем заказ из-за неё
  if (!firstName || !phone || !email || !deliveryMethod || !paymentMethod) {
    return res.status(400).json({ error: "Заполните все обязательные поля" });
  }
  if (!PAYMENT_METHODS.has(paymentMethod)) {
    return res.status(400).json({ error: "Недоступный способ оплаты" });
  }
  if (paymentMethod === "dolyame" && !dolyameConfigured()) {
    return res.status(503).json({ error: "Оплата «Долями» временно недоступна. Заказ не оформлен, попробуйте позже или выберите другой способ оплаты." });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Корзина пуста" });
  }

  const requestedProductIds = items.map((item: { productId: number }) => Number(item.productId));
  const orderableProducts = await prisma.product.findMany({
    where: { id: { in: requestedProductIds } },
    select: { id: true, inStock: true, availableOnRequest: true },
  });
  if (orderableProducts.some((product) => !product.inStock && !product.availableOnRequest)) {
    return res.status(409).json({ error: "Один или несколько товаров больше недоступны для заказа" });
  }

  const deliveryPrice = DELIVERY_PRICES[deliveryMethod] ?? 0;

  // Пересчёт цен со скидкой по купону (если указан). Всё считается на сервере.
  const {
    unitPriceByProductId, nameByProductId, itemsTotal,
    missingProductId, error: couponError,
  } = await applyCoupon(items, couponCode);

  if (missingProductId != null) {
    return res.status(400).json({ error: `Товар ${missingProductId} не найден` });
  }
  if (couponCode && couponError) {
    return res.status(400).json({ error: couponError });
  }

  const totalPrice = itemsTotal + deliveryPrice;

  const order = await prisma.order.create({
    data: {
      firstName, lastName: lastName ?? "", phone, email,
      deliveryMethod, city, address, apartment, comment,
      totalPrice,
      items: {
        create: items.map((item: { productId: number; size: string; quantity: number }) => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
          price: unitPriceByProductId.get(item.productId)!,
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

      notifyShop(order, paymentMethod, order.items, nameByProductId);

      return res.status(201).json({ ...order, confirmationUrl });
    } catch (err) {
      console.error("ЮKасса payment creation failed:", err);
      await prisma.payment.update({ where: { orderId: order.id }, data: { status: "failed" } });
      return res.status(502).json({ error: "Не удалось создать ссылку на оплату в ЮKассе. Платёж не создан, корзина сохранена — попробуйте ещё раз или выберите другой способ оплаты." });
    }
  }

  if (paymentMethod === "dolyame") {
    try {
      // Позиции для «Долями»: товары + строка доставки, чтобы сумма позиций
      // совпадала с amount (иначе API отклонит заявку).
      const dolyameItems = items.map((item: { productId: number; quantity: number }) => ({
        name: nameByProductId.get(item.productId) ?? `Товар ${item.productId}`,
        quantity: item.quantity,
        price: unitPriceByProductId.get(item.productId)!,
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

      notifyShop(order, paymentMethod, order.items, nameByProductId);

      return res.status(201).json({ ...order, confirmationUrl: link });
    } catch (err) {
      console.error("Долями order creation failed:", err);
      await prisma.payment.update({ where: { orderId: order.id }, data: { status: "failed" } });
      return res.status(502).json({ error: "Не удалось создать ссылку на оплату через «Долями». Платёж не создан, корзина сохранена — попробуйте ещё раз или выберите другой способ оплаты." });
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
