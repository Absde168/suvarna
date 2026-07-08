// mTLS-клиент для API «Долями» (сервис T-Банка).
// Авторизация двойная: клиентский TLS-сертификат (mTLS) + HTTP Basic (логин/пароль).
// Сертификат и ключ кладутся на сервер, пути задаются через env.
//
// ⚠️ Точный demo-URL и часть полей чека (receipt) подтверждаются с командой T-Банка
//    на этапе тестирования — помечено комментариями TODO:confirm.

import fs from "fs";
import https from "https";
import { randomUUID } from "crypto";

const BASE_URL = (process.env.DOLYAME_BASE_URL || "https://partner.dolyame.ru/v1").replace(/\/+$/, "");
const LOGIN = process.env.DOLYAME_LOGIN || "";
const PASSWORD = process.env.DOLYAME_PASSWORD || "";
const CERT_PATH = process.env.DOLYAME_CERT_PATH || "/app/secrets/dolyame-cert.pem";
const KEY_PATH = process.env.DOLYAME_KEY_PATH || "/app/secrets/dolyame-key.pem";
const APP_URL = process.env.APP_URL || "https://iamsuvarna.ru";

let cachedAgent: https.Agent | null = null;

// Агент с mTLS создаётся лениво — приложение стартует даже без сертификата,
// ошибка возникнет только при реальном обращении к «Долями».
function getAgent(): https.Agent {
  if (!cachedAgent) {
    const cert = fs.readFileSync(CERT_PATH);
    const key = fs.readFileSync(KEY_PATH);
    cachedAgent = new https.Agent({ cert, key, keepAlive: true });
  }
  return cachedAgent;
}

export function dolyameConfigured(): boolean {
  return Boolean(LOGIN && PASSWORD && fs.existsSync(CERT_PATH) && fs.existsSync(KEY_PATH));
}

function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  const payload = body ? JSON.stringify(body) : undefined;
  const auth = Buffer.from(`${LOGIN}:${PASSWORD}`).toString("base64");

  return new Promise<T>((resolve, reject) => {
    const req = https.request(
      {
        method,
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        agent: getAgent(),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
          "X-Correlation-ID": randomUUID(),
          ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          const status = res.statusCode ?? 0;
          if (status >= 200 && status < 300) {
            resolve(data ? (JSON.parse(data) as T) : ({} as T));
          } else {
            reject(new Error(`Долями error ${status}: ${data}`));
          }
        });
      },
    );
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

export interface DolyameItem {
  name: string;
  quantity: number;
  price: number; // цена за единицу в рублях
}

export interface CreateDolyameOrderParams {
  orderId: number;
  amount: number; // сумма к разбивке на 4 платежа, в рублях
  prepaidAmount?: number; // предоплаченная часть (например, баллами), в рублях
  items: DolyameItem[];
  client: {
    firstName: string;
    lastName: string;
    phone: string; // формат +79991112233
    email: string;
  };
}

export interface CreateDolyameOrderResult {
  link: string; // ссылка для редиректа покупателя на «Долями»
  raw: unknown;
}

// «Долями» требует номер строго в формате +79991112233.
// Приводим ввод с формы (+7 (999) 999-99-99, 8..., пробелы) к этому виду.
function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (digits.length === 10) digits = "7" + digits;
  return "+" + digits;
}

// Метод Create — создаёт заявку в «Долями» и возвращает ссылку для оплаты.
export async function createDolyameOrder(
  params: CreateDolyameOrderParams,
): Promise<CreateDolyameOrderResult> {
  const body = {
    order: {
      id: `suvarna_${params.orderId}`,
      amount: params.amount.toFixed(2),
      prepaid_amount: (params.prepaidAmount ?? 0).toFixed(2),
      items: params.items.map((it) => ({
        name: it.name,
        quantity: it.quantity,
        price: it.price.toFixed(2),
        // TODO:confirm — параметры чека по 54-ФЗ уточнить с T-Банком на тесте
        receipt: {
          tax: "none",
          payment_method: "full_prepayment",
          payment_object: "commodity",
          measurement_unit: "шт",
        },
      })),
    },
    client_info: {
      first_name: params.client.firstName,
      last_name: params.client.lastName,
      phone: normalizePhone(params.client.phone),
      email: params.client.email,
    },
    notification_url: `${APP_URL}/api/dolyame/notify`,
    fail_url: `${APP_URL}/payment/return?orderId=${params.orderId}`,
    success_url: `${APP_URL}/payment/return?orderId=${params.orderId}`,
  };

  const data = await request<{ link?: string; url?: string }>("POST", "/orders/create", body);
  const link = data.link || data.url || "";
  return { link, raw: data };
}

// Метод Info — статус заявки.
export async function getDolyameOrder(dolyameOrderId: string): Promise<unknown> {
  return request("GET", `/orders/${encodeURIComponent(dolyameOrderId)}`);
}

// Метод Commit — подтверждение заявки (после отгрузки). Передаются те же
// значения amount / prepaid_amount / items, что и при создании.
export async function commitDolyameOrder(
  dolyameOrderId: string,
  params: { amount: number; prepaidAmount?: number; items: DolyameItem[] },
): Promise<unknown> {
  const body = {
    amount: params.amount.toFixed(2),
    prepaid_amount: (params.prepaidAmount ?? 0).toFixed(2),
    items: params.items.map((it) => ({
      name: it.name,
      quantity: it.quantity,
      price: it.price.toFixed(2),
      receipt: {
        tax: "none",
        payment_method: "full_prepayment",
        payment_object: "commodity",
        measurement_unit: "шт",
      },
    })),
  };
  return request("POST", `/orders/${encodeURIComponent(dolyameOrderId)}/commit`, body);
}

// Метод Refund — возврат (полный или частичный). Для частичного передаём
// возвращаемые позиции и сумму возврата.
// TODO:confirm — точные названия полей (returned_items / amount) сверить на тесте.
export async function refundDolyameOrder(
  dolyameOrderId: string,
  params: { amount: number; prepaidAmount?: number; returnedItems: DolyameItem[] },
): Promise<unknown> {
  const body = {
    amount: params.amount.toFixed(2),
    returned_items: params.returnedItems.map((it) => ({
      name: it.name,
      quantity: it.quantity,
      price: it.price.toFixed(2),
      receipt: {
        tax: "none",
        payment_method: "full_prepayment",
        payment_object: "commodity",
        measurement_unit: "шт",
      },
    })),
    ...(params.prepaidAmount ? { prepaid_amount: params.prepaidAmount.toFixed(2) } : {}),
  };
  return request("POST", `/orders/${encodeURIComponent(dolyameOrderId)}/refund`, body);
}
