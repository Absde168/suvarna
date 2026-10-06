import { useEffect } from "react";

const SITE_URL = "https://iamsuvarna.ru";

const pageMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "SUVARNA — дизайнерская женская одежда",
    description: "Российский бренд дизайнерской женской одежды с индийским наследием. Платья, жакеты, костюмы и другие изделия SUVARNA.",
  },
  "/catalog": {
    title: "Каталог женской одежды — SUVARNA",
    description: "Каталог дизайнерской женской одежды SUVARNA: платья, жакеты, брюки, костюмы, тренчи и блузы.",
  },
  "/collections": {
    title: "Коллекции — SUVARNA",
    description: "Коллекции дизайнерской одежды SUVARNA, вдохновлённые индийским наследием и современным стилем.",
  },
  "/about": {
    title: "О бренде SUVARNA",
    description: "История SUVARNA — российского бренда женской одежды, объединяющего индийское наследие и современный дизайн.",
  },
  "/delivery": {
    title: "Доставка и оплата — SUVARNA",
    description: "Способы и сроки доставки, варианты оплаты и условия получения заказов SUVARNA.",
  },
  "/contacts": {
    title: "Контакты SUVARNA",
    description: "Контакты SUVARNA: телефон, электронная почта, адрес шоурума в Москве и ссылки на социальные сети.",
  },
};

function setMeta(name: string, content: string, attribute: "name" | "property" = "name") {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function Seo({
  title,
  description,
  path,
}: {
  title?: string;
  description?: string;
  path: string;
}) {
  useEffect(() => {
    // Product pages set metadata only after their API data has loaded.
    if (path.startsWith("/product/")) return;
    const defaults = pageMetadata[path] ?? {
      title: "SUVARNA — дизайнерская женская одежда",
      description: "Дизайнерская женская одежда SUVARNA.",
    };
    const pageTitle = title ?? defaults.title;
    const pageDescription = description ?? defaults.description;
    const canonicalUrl = new URL(path, SITE_URL).toString();

    document.title = pageTitle;
    setMeta("description", pageDescription);
    setMeta("og:title", pageTitle, "property");
    setMeta("og:description", pageDescription, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("twitter:card", "summary_large_image");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [description, path, title]);

  return null;
}

export function ProductStructuredData({ data }: { data: Record<string, unknown> }) {
  useEffect(() => {
    const id = "seo-product-jsonld";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => script?.remove();
  }, [data]);

  return null;
}
