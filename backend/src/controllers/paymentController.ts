import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

export async function yokassaWebhook(req: Request, res: Response) {
  try {
    const event = req.body;

    if (!event || !event.object) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const yokassaPaymentId: string = event.object.id;
    const yokassaStatus: string = event.object.status;

    const payment = await prisma.payment.findFirst({
      where: { providerId: yokassaPaymentId },
    });

    if (!payment) {
      // Не наш платёж — отвечаем 200 чтобы ЮKасса не повторяла
      return res.status(200).json({ ok: true });
    }

    if (yokassaStatus === "succeeded") {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "paid",
            paidAt: new Date(event.object.captured_at || new Date()),
          },
        }),
        prisma.order.update({
          where: { id: payment.orderId },
          data: { status: "paid" },
        }),
      ]);
    } else if (yokassaStatus === "canceled") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "failed" },
      });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Internal error" });
  }
}
