import nodemailer from "nodemailer";

interface OrderNotification {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  paymentMethod: string;
  deliveryMethod: string;
  city?: string | null;
  address?: string | null;
  apartment?: string | null;
  comment?: string | null;
  totalPrice: number;
  items: Array<{ name: string; size: string; quantity: number; price: number }>;
}

const formatPrice = (value: number) => `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;

export async function sendOrderNotification(order: OrderNotification): Promise<void> {
  const user = process.env.SMTP_USER;
  const encodedPassword = process.env.SMTP_PASSWORD_B64;
  const recipient = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!user || !encodedPassword || !recipient) {
    console.warn("Order notification email skipped: SMTP settings are incomplete");
    return;
  }
  const password = Buffer.from(encodedPassword, "base64").toString("utf8");

  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.yandex.ru",
    port,
    secure: port === 465,
    auth: { user, pass: password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  const itemLines = order.items.map((item) =>
    `• ${item.name}, размер ${item.size}, ${item.quantity} шт. × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`
  );
  const deliveryAddress = [order.city, order.address, order.apartment && `кв./офис ${order.apartment}`]
    .filter(Boolean)
    .join(", ");
  const paymentLabels: Record<string, string> = {
    card: "Банковская карта",
    sbp: "СБП",
    dolyame: "Долями",
  };
  const deliveryLabels: Record<string, string> = {
    courier: "Курьер",
    pickup: "Самовывоз",
    cdek: "СДЭК",
    post: "Почта России",
  };

  const text = [
    `Новый заказ №${order.id}`,
    "",
    `Покупатель: ${order.firstName} ${order.lastName}`.trim(),
    `Телефон: ${order.phone}`,
    `Email: ${order.email}`,
    `Оплата: ${paymentLabels[order.paymentMethod] ?? order.paymentMethod}`,
    `Доставка: ${deliveryLabels[order.deliveryMethod] ?? order.deliveryMethod}`,
    deliveryAddress ? `Адрес: ${deliveryAddress}` : undefined,
    order.comment ? `Комментарий: ${order.comment}` : undefined,
    "",
    "Товары:",
    ...itemLines,
    "",
    `Итого: ${formatPrice(order.totalPrice)}`,
  ].filter((line): line is string => line !== undefined).join("\n");

  await transporter.sendMail({
    from: user,
    to: recipient,
    replyTo: order.email,
    subject: `Новый заказ №${order.id} — SUVARNA`,
    text,
  });
}
