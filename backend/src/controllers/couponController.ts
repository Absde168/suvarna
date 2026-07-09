import type { Request, Response } from "express";
import { applyCoupon } from "../coupons/apply.js";

// Предпросмотр скидки по купону для товаров в корзине.
// Тело: { code, items: [{ productId, quantity }] }
export async function validateCoupon(req: Request, res: Response) {
  const { code, items } = req.body as {
    code?: string;
    items?: { productId: number; quantity: number }[];
  };

  if (!code?.trim()) {
    return res.status(400).json({ valid: false, error: "Введите код купона" });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ valid: false, error: "Корзина пуста" });
  }

  const result = await applyCoupon(items, code);

  if (result.error) {
    return res.status(200).json({ valid: false, error: result.error });
  }
  if (result.appliedProductIds.length === 0) {
    return res.status(200).json({
      valid: false,
      error: "Купон не применим к товарам в корзине",
    });
  }

  res.json({
    valid: true,
    code: result.coupon!.code,
    percent: result.coupon!.percent,
    discount: result.discount,
    itemsTotal: result.itemsTotal,
    appliedProductIds: result.appliedProductIds,
  });
}
