import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ROOT = path.resolve(import.meta.dirname, "../..");
const IMAGES_ROOT = path.join(ROOT, "images");
const XLSX_PATH = path.join(ROOT, "dataexel.xlsx");

// Категория (из колонки "Категория для фильтра" или вычисленная) -> { slug, name, folder }
const CATEGORY_INFO = {
  "ЖАКЕТЫ": { name: "Жакеты", slug: "zhakety", folder: "ЖАКЕТЫ" },
  "БРЮКИ": { name: "Брюки", slug: "bryuki", folder: "БРЮКИ" },
  "КОСТЮМЫ": { name: "Костюмы", slug: "kostyumy", folder: "КОСТЮМЫ Bemberg" },
  "ТРЕНЧИ": { name: "Тренчи", slug: "trenchi", folder: "ТРЕНЧИ" },
  "ПЛАТЬЯ": { name: "Платья", slug: "platya", folder: "ПЛАТЬЯ Bemberg" },
  "НОВИНКИ": { name: "Новинки", slug: "novinki", folder: "Комлекты 2-в-1 AI generated" },
  "БЛУЗЫ": { name: "Блузы", slug: "bluzy", folder: "БЛУЗЫ" },
};

function normalizeFilename(name) {
  // Заменяем кириллические С/с на латинские C/c (встречаются в excel вперемешку)
  return name.replace(/С/g, "C").replace(/с/g, "c");
}

function mimeFromExt(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpeg" || ext === ".jpg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

// Регистронезависимый и Cyrillic/Latin-нормализованный поиск файла в папке
function findFile(folder, filename) {
  const dir = path.join(IMAGES_ROOT, folder);
  if (!fs.existsSync(dir)) return null;
  const target = normalizeFilename(filename).toLowerCase();
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    if (normalizeFilename(entry).toLowerCase() === target) {
      return path.join(dir, entry);
    }
  }
  return null;
}

function emptyToNull(v) {
  if (v === undefined || v === null) return null;
  if (typeof v === "string" && v.trim() === "") return null;
  return v;
}

async function main() {
  const wb = xlsx.readFile(XLSX_PATH);
  const sheet = wb.Sheets["Каталог"];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null });
  const data = rows.slice(1).filter((r) => r[1]); // строки с артикулом

  const report = {
    categoriesCreated: [],
    products: [],
    imagesImported: 0,
    imagesMissing: [],
    duplicateArticles: [],
  };

  // Подготовим категории
  const categoryIds = {};
  for (const info of Object.values(CATEGORY_INFO)) {
    const cat = await prisma.category.upsert({
      where: { slug: info.slug },
      update: {},
      create: { name: info.name, slug: info.slug },
    });
    categoryIds[info.slug] = cat.id;
    report.categoriesCreated.push(`${info.name} (${info.slug})`);
  }

  const seenArticles = new Set();

  for (const r of data) {
    const [
      , article, categoryRaw, , name, description, fabric, care,
      , , price, photo1, photo2, photo3, photo4, photo5,
    ] = r;

    // Определяем категорию
    let categoryKey = categoryRaw ? categoryRaw.trim() : null;
    if (!categoryKey) {
      if (article.startsWith("SUS")) categoryKey = "БЛУЗЫ";
      else if (article.startsWith("SUD")) categoryKey = "ПЛАТЬЯ";
    }
    const catInfo = CATEGORY_INFO[categoryKey];

    // Уникальность артикула: SUC001/SUC002 встречаются в КОСТЮМЫ и НОВИНКИ
    let finalArticle = article;
    if (seenArticles.has(article)) {
      finalArticle = `${article}-2IN1`;
      report.duplicateArticles.push({ original: article, renamed: finalArticle, category: categoryKey });
    }
    seenArticles.add(article);

    const photos = [photo1, photo2, photo3, photo4, photo5].filter(Boolean);
    const imagesData = [];
    for (let i = 0; i < photos.length; i++) {
      const filePath = catInfo ? findFile(catInfo.folder, photos[i]) : null;
      if (filePath) {
        imagesData.push({
          data: fs.readFileSync(filePath),
          mimeType: mimeFromExt(filePath),
          position: i,
        });
        report.imagesImported++;
      } else {
        report.imagesMissing.push({ article: finalArticle, file: photos[i], folder: catInfo?.folder ?? null });
      }
    }

    const product = await prisma.product.create({
      data: {
        name: emptyToNull(name) ?? finalArticle,
        article: finalArticle,
        price: typeof price === "number" ? Math.round(price) : 0,
        sizes: [],
        colors: [],
        description: emptyToNull(description),
        fabric: emptyToNull(fabric),
        care: emptyToNull(care),
        categoryId: catInfo ? categoryIds[catInfo.slug] : null,
        images: { create: imagesData },
      },
    });

    report.products.push({ article: finalArticle, category: categoryKey, images: imagesData.length });
  }

  console.log(JSON.stringify(report, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
