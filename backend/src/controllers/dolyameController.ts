import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { createDolyameOrder, commitDolyameOrder, dolyameConfigured } from "../dolyame/client.js";

// Создать заявку «Долями» для существующего заказа и вернуть ссылку на оплату.
// Используется как для теста с командой T-Банка, так и в боевом флоу оформления.
export async function createDolyamePayment(req: Request, res: Response) {
  if (!dolyameConfigured()) {
    return res.status(503).json({ error: "Долями не настроена: нет доступов или сертификата" });
  }

  const orderId = Number(req.body.orderId ?? req.params.orderId);
  if (Number.isNaN(orderId)) {
    return res.status(400).json({ error: "Некорректный orderId" });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
      email: true,
      totalPrice: true,
      items: {
        select: {
          quantity: true,
          price: true,
          product: { select: { name: true } },
        },
      },
    },
  });

  if (!order) {
    return res.status(404).json({ error: "Заказ не найден" });
  }

  try {
    const result = await createDolyameOrder({
      orderId: order.id,
      amount: order.totalPrice,
      items: order.items.map((it) => ({
        name: it.product.name,
        quantity: it.quantity,
        price: it.price,
      })),
      client: {
        firstName: order.firstName,
        lastName: order.lastName,
        phone: order.phone,
        email: order.email,
      },
    });

    await prisma.payment.updateMany({
      where: { orderId: order.id },
      data: { method: "dolyame" },
    });

    return res.json({ link: result.link });
  } catch (err) {
    console.error("Долями create failed:", err);
    return res.status(502).json({ error: String(err) });
  }
}

// Статусы «Долями», при которых заявку нужно подтвердить (commit).
// TODO:confirm — точные названия статусов сверить с T-Банком на боевом заказе.
const APPROVED_STATUSES = new Set(["approved", "wait_for_commit"]);
const PAID_STATUSES = new Set(["committed", "completed"]);

// Авто-commit: подтверждаем заявку, чтобы магазин получил деньги без ручного
// действия. Позиции восстанавливаем из заказа (цены со скидкой уже сохранены),
// строку доставки вычисляем как разницу с суммой позиций.
async function autoCommit(orderId: number, dolyameOrderId: string): Promise<boolean> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      totalPrice: true,
      items: { select: { quantity: true, price: true, product: { select: { name: true } } } },
    },
  });
  if (!order) return false;

  const items = order.items.map((it) => ({
    name: it.product.name,
    quantity: it.quantity,
    price: it.price,
  }));
  const itemsSum = order.items.reduce((s, it) => s + it.price * it.quantity, 0);
  const delivery = order.totalPrice - itemsSum;
  if (delivery > 0) items.push({ name: "Доставка", quantity: 1, price: delivery });

  await commitDolyameOrder(dolyameOrderId, { amount: order.totalPrice, items });
  return true;
}

// Приём уведомлений (вебхук) от «Долями» об изменении статуса заявки.
// TODO:confirm — точный формат payload и статусы сверить с T-Банком на тесте.
export async function handleDolyameNotification(req: Request, res: Response) {
  console.log("Долями notification:", JSON.stringify(req.body));

  const dolyameOrderId: string | undefined = req.body?.order?.id ?? req.body?.id;
  const status: string | undefined = req.body?.status;

  // suvarna_<orderId> -> orderId
  const localId = dolyameOrderId?.startsWith("suvarna_")
    ? Number(dolyameOrderId.slice("suvarna_".length))
    : NaN;

  if (!Number.isNaN(localId) && status && dolyameOrderId) {
    const payment = await prisma.payment.findUnique({
      where: { orderId: localId },
      select: { status: true },
    });
    const alreadyPaid = payment?.status === "paid";

    if (APPROVED_STATUSES.has(status) && !alreadyPaid) {
      // Одобрено покупателем — подтверждаем заявку и помечаем оплаченным.
      try {
        await autoCommit(localId, dolyameOrderId);
        await prisma.payment.updateMany({
          where: { orderId: localId },
          data: { status: "paid", paidAt: new Date() },
        });
      } catch (err) {
        console.error(`Долями auto-commit failed for order ${localId}:`, err);
      }
    } else if (PAID_STATUSES.has(status)) {
      await prisma.payment.updateMany({
        where: { orderId: localId },
        data: { status: "paid", paidAt: new Date() },
      });
    } else if (status === "rejected" || status === "canceled") {
      await prisma.payment.updateMany({ where: { orderId: localId }, data: { status: "failed" } });
    } else if (status === "refunded") {
      await prisma.payment.updateMany({ where: { orderId: localId }, data: { status: "refunded" } });
    }
  }

  // «Долями» ожидает 200 в ответ на уведомление
  res.status(200).json({ ok: true });
}
