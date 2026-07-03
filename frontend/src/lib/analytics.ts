// Единая точка отправки событий в Яндекс.Метрику и Google Analytics.
// Метрика: цели создаются в кабинете как «JavaScript-событие» с идентификаторами
//   add_to_cart и purchase.
// GA4: add_to_cart и purchase — стандартные события, отмечаются как ключевые.

const YM_COUNTER_ID = 110361224;

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackAddToCart(params: {
  id: number;
  name: string;
  price: number;
  quantity: number;
}) {
  const { id, name, price, quantity } = params;
  try {
    window.ym?.(YM_COUNTER_ID, "reachGoal", "add_to_cart");
    window.gtag?.("event", "add_to_cart", {
      currency: "RUB",
      value: price * quantity,
      items: [{ item_id: String(id), item_name: name, price, quantity }],
    });
  } catch {
    /* аналитика не должна ломать основной поток */
  }
}

export function trackPurchase(params: { orderId: number; value: number }) {
  const { orderId, value } = params;
  try {
    window.ym?.(YM_COUNTER_ID, "reachGoal", "purchase");
    window.gtag?.("event", "purchase", {
      transaction_id: String(orderId),
      currency: "RUB",
      value,
    });
  } catch {
    /* аналитика не должна ломать основной поток */
  }
}
