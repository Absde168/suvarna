import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { createDolyameOrder, dolyameConfigured } from "../dolyame/client.js";

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

  if (!Number.isNaN(localId) && status) {
    const map: Record<string, string> = {
      approved: "paid",
      committed: "paid",
      completed: "paid",
      rejected: "failed",
      canceled: "failed",
      refunded: "refunded",
    };
    const mapped = map[status];
    if (mapped) {
      await prisma.payment.updateMany({
        where: { orderId: localId },
        data: { status: mapped, ...(mapped === "paid" ? { paidAt: new Date() } : {}) },
      });
    }
  }

  // «Долями» ожидает 200 в ответ на уведомление
  res.status(200).json({ ok: true });
}
