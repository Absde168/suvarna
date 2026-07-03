import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

const SITE_URL = (process.env.SITE_URL || "https://iamsuvarna.ru").replace(/\/+$/, "");

const STATIC_PAGES: { path: string; changefreq: string; priority: string }[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/catalog", changefreq: "daily", priority: "0.9" },
  { path: "/collections", changefreq: "weekly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/delivery", changefreq: "monthly", priority: "0.5" },
  { path: "/contacts", changefreq: "monthly", priority: "0.5" },
  { path: "/size-guide", changefreq: "monthly", priority: "0.4" },
  { path: "/returns", changefreq: "monthly", priority: "0.4" },
  { path: "/care", changefreq: "monthly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc: string, opts: { lastmod?: string; changefreq?: string; priority?: string } = {}): string {
  const parts = [`    <loc>${xmlEscape(loc)}</loc>`];
  if (opts.lastmod) parts.push(`    <lastmod>${opts.lastmod}</lastmod>`);
  if (opts.changefreq) parts.push(`    <changefreq>${opts.changefreq}</changefreq>`);
  if (opts.priority) parts.push(`    <priority>${opts.priority}</priority>`);
  return `  <url>\n${parts.join("\n")}\n  </url>`;
}

export async function getSitemap(_req: Request, res: Response) {
  const [products, collections] = await Promise.all([
    prisma.product.findMany({ select: { id: true, updatedAt: true } }),
    prisma.collection.findMany({ select: { slug: true } }),
  ]);

  const entries: string[] = [];

  for (const page of STATIC_PAGES) {
    entries.push(urlEntry(`${SITE_URL}${page.path}`, { changefreq: page.changefreq, priority: page.priority }));
  }

  for (const c of collections) {
    entries.push(urlEntry(`${SITE_URL}/collections/${c.slug}`, { changefreq: "weekly", priority: "0.7" }));
  }

  for (const p of products) {
    entries.push(
      urlEntry(`${SITE_URL}/product/${p.id}`, {
        lastmod: p.updatedAt.toISOString().slice(0, 10),
        changefreq: "weekly",
        priority: "0.8",
      }),
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;

  res.header("Content-Type", "application/xml; charset=utf-8");
  res.send(xml);
}
