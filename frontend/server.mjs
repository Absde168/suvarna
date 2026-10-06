import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const app = express();
const port = Number(process.env.PORT || 3000);
const publicDir = path.resolve("dist");
const template = await fs.readFile(path.join(publicDir, "index.html"), "utf8");
const { render } = await import(pathToFileURL(path.resolve("dist-server/entry-server.js")).href);
const siteUrl = (process.env.PUBLIC_SITE_URL || "https://iamsuvarna.ru").replace(/\/$/, "");

app.use(express.static(publicDir, { maxAge: "1y", immutable: true, index: false }));

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function jsonForHtml(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function pageSeo(pathname, search, queryClient) {
  const productId = Number(pathname.match(/^\/product\/(\d+)/)?.[1]);
  if (productId) {
    const product = queryClient.getQueryData(["products", "detail", productId]);
    if (product) {
      const title = `${product.name} — купить в интернет-магазине SUVARNA`;
      const description = (product.description || `${product.name} — дизайнерская одежда SUVARNA. Цена: ${product.price.toLocaleString("ru-RU")} ₽.`).slice(0, 160);
      const image = product.images?.[0] ? `${siteUrl}/api/images/${product.images[0].id}` : undefined;
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description || product.name,
        sku: product.article,
        ...(image ? { image } : {}),
        brand: { "@type": "Brand", name: "SUVARNA" },
        category: product.categories?.map((item) => item.name).join(", "),
        offers: {
          "@type": "Offer",
          url: `${siteUrl}/product/${product.id}`,
          priceCurrency: "RUB",
          price: product.price,
          availability: product.inStock || product.availableOnRequest ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@type": "Organization", name: "SUVARNA" },
        },
      };
      return { title, description, image, jsonLd: structuredData };
    }
  }

  const collectionSlug = pathname.match(/^\/collections\/([^/]+)/)?.[1];
  if (collectionSlug) {
    const collection = queryClient.getQueryData(["collections", "detail", collectionSlug]);
    if (collection) {
      return {
        title: `${collection.name} — коллекция SUVARNA`,
        description: (collection.description || `Коллекция ${collection.name} от SUVARNA. Дизайнерская женская одежда с авторским стилем.`).slice(0, 160),
      };
    }
  }

  if (pathname === "/catalog") {
    const params = new URLSearchParams(search);
    const categorySlug = params.get("category");
    const collectionFilter = params.get("collection");
    if (categorySlug) {
      const category = queryClient.getQueryData(["categories"])?.find((item) => item.slug === categorySlug);
      if (category) return { title: `${category.name} — каталог SUVARNA`, description: `Купить дизайнерскую женскую одежду в категории «${category.name}» SUVARNA.` };
    }
    if (collectionFilter) {
      const collection = queryClient.getQueryData(["collections"])?.find((item) => item.slug === collectionFilter);
      if (collection) return { title: `${collection.name} — каталог SUVARNA`, description: `Товары коллекции ${collection.name} от SUVARNA.` };
    }
  }

  const pages = {
    "/": ["SUVARNA — дизайнерская женская одежда", "Российский бренд дизайнерской женской одежды с индийским наследием. Платья, жакеты, костюмы и другие изделия SUVARNA."],
    "/catalog": ["Каталог женской одежды — SUVARNA", "Каталог дизайнерской женской одежды SUVARNA: платья, жакеты, брюки, костюмы, тренчи и блузы."],
    "/collections": ["Коллекции — SUVARNA", "Коллекции дизайнерской одежды SUVARNA, вдохновлённые индийским наследием и современным стилем."],
    "/about": ["О бренде SUVARNA", "История SUVARNA — российского бренда женской одежды, объединяющего индийское наследие и современный дизайн."],
    "/delivery": ["Доставка и оплата — SUVARNA", "Способы и сроки доставки, варианты оплаты и условия получения заказов SUVARNA."],
    "/contacts": ["Контакты SUVARNA", "Контакты SUVARNA: телефон, электронная почта, адрес шоурума в Москве и ссылки на социальные сети."],
  };
  const [title, description] = pages[pathname] || ["SUVARNA — дизайнерская женская одежда", "Дизайнерская женская одежда SUVARNA."];
  return { title, description };
}

app.get("*", async (req, res) => {
  const requestUrl = `${req.path}${req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""}`;
  try {
    const rendered = await render(requestUrl);
    const seo = pageSeo(rendered.path, new URLSearchParams(requestUrl.split("?")[1] || "").toString(), rendered.queryClient);
    const canonical = `${siteUrl}${req.path}`;
    const title = escapeHtml(seo.title);
    const description = escapeHtml(seo.description);
    const headTags = [
      `<meta name="description" content="${description}">`,
      `<link rel="canonical" href="${escapeHtml(canonical)}">`,
      `<meta property="og:title" content="${title}">`,
      `<meta property="og:description" content="${description}">`,
      `<meta property="og:type" content="${seo.jsonLd ? "product" : "website"}">`,
      `<meta property="og:url" content="${escapeHtml(canonical)}">`,
      seo.image ? `<meta property="og:image" content="${escapeHtml(seo.image)}">` : "",
      seo.jsonLd ? `<script id="seo-product-jsonld" type="application/ld+json">${jsonForHtml(seo.jsonLd)}</script>` : "",
    ].filter(Boolean).join("\n    ");

    const stateScript = `<script>window.__SUVARNA_QUERY_STATE__=${jsonForHtml(rendered.queryState)};</script>`;
    const html = template
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
      .replace(/<meta\s+name="description"[^>]*>/i, "")
      .replace("</head>", `    ${headTags}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${rendered.appHtml}</div>`)
      .replace("</body>", `  ${stateScript}\n  </body>`);

    res.status(rendered.missingResource ? 404 : 200).send(html);
  } catch (error) {
    console.error("SSR request failed:", req.path, error);
    res.status(500).send(template);
  }
});

app.listen(port, "0.0.0.0", () => console.log(`SUVARNA SSR server listening on ${port}`));
