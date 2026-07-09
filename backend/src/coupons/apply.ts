import { prisma } from "../prisma.js";

export interface CartItemInput {
  productId: number;
  quantity: number;
}

export interface ApplyCouponResult {
  unitPriceByProductId: Map<number, number>; // цена за единицу со скидкой
  nameByProductId: Map<number, string>;
  itemsTotal: number; // сумма позиций со скидкой (без доставки)
  originalTotal: number; // сумма без скидки
  discount: number; // размер скидки в рублях
  coupon: { code: string; percent: number } | null;
  appliedProductIds: number[]; // товары, к которым применилась скидка
  missingProductId?: number; // товар из корзины не найден
  error?: string; // купон указан, но невалиден
}

// Считает цены позиций с учётом купона. Скидка применяется к товару
// (productId) или ко всем товарам категории (categoryId). Купон приходит
// как код — цена всегда пересчитывается на сервере, фронту не доверяем.
export async function applyCoupon(
  items: CartItemInput[],
  code?: string | null,
): Promise<ApplyCouponResult> {
  const productIds = [...new Set(items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true, name: true, categories: { select: { id: true } } },
  });
  const pById = new Map(products.map((p) => [p.id, p]));

  let coupon: { code: string; percent: number; productId: number | null; categoryId: number | null } | null = null;
  let error: string | undefined;

  const trimmed = code?.trim();
  if (trimmed) {
    const found = await prisma.coupon.findUnique({ where: { code: trimmed } });
    if (!found || !found.active) {
      error = "Купон не найден или неактивен";
    } else {
      coupon = { code: found.code, percent: found.percent, productId: found.productId, categoryId: found.categoryId };
    }
  }

  const unitPriceByProductId = new Map<number, number>();
  const nameByProductId = new Map<number, string>();
  const appliedProductIds: number[] = [];
  let missingProductId: number | undefined;

  for (const pid of productIds) {
    const p = pById.get(pid);
    if (!p) {
      missingProductId = pid;
      continue;
    }
    let price = p.price;
    if (coupon) {
      const matchesProduct = coupon.productId != null && coupon.productId === p.id;
      const matchesCategory =
        coupon.categoryId != null && p.categories.some((c) => c.id === coupon!.categoryId);
      if (matchesProduct || matchesCategory) {
        price = Math.round((p.price * (100 - coupon.percent)) / 100);
        appliedProductIds.push(p.id);
      }
    }
    unitPriceByProductId.set(p.id, price);
    nameByProductId.set(p.id, p.name);
  }

  let itemsTotal = 0;
  let originalTotal = 0;
  for (const item of items) {
    const p = pById.get(item.productId);
    if (!p) continue;
    itemsTotal += (unitPriceByProductId.get(item.productId) ?? p.price) * item.quantity;
    originalTotal += p.price * item.quantity;
  }

  return {
    unitPriceByProductId,
    nameByProductId,
    itemsTotal,
    originalTotal,
    discount: originalTotal - itemsTotal,
    coupon: coupon ? { code: coupon.code, percent: coupon.percent } : null,
    appliedProductIds,
    missingProductId,
    error,
  };
}
