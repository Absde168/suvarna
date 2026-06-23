const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, BorderStyle, WidthType, ShadingType,
        Header, Footer, PageNumber, LevelFormat } = require("docx");

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };
const accentColor = "C17A5A";
const darkColor = "2D2D2D";
const lightBg = "FFF8F2";

function hCell(text, width) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: { fill: accentColor, type: ShadingType.CLEAR },
    margins: cellMargins, verticalAlign: "center",
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text, bold: true, color: "FFFFFF", font: "Arial", size: 20 })
    ]})]
  });
}

function c(text, width, opts = {}) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: opts.bg ? { fill: opts.bg, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins, verticalAlign: "center",
    children: [new Paragraph({
      alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [new TextRun({ text, bold: !!opts.bold, font: "Arial", size: opts.size || 20, color: opts.color || darkColor })]
    })]
  });
}

function gap(s) { return new Paragraph({ spacing: { after: s || 100 }, children: [] }); }

function secTitle(text) {
  return new Paragraph({
    spacing: { before: 300, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: accentColor, space: 4 } },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 28, color: accentColor })]
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 20 })]
  });
}

function tariffDesc(title, desc) {
  return [
    new Paragraph({ spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: title, bold: true, font: "Arial", size: 24, color: accentColor })] }),
    new Paragraph({ spacing: { after: 60 },
      children: [new TextRun({ text: desc, font: "Arial", size: 20 })] })
  ];
}

const W = [3000, 1626, 1626, 1627, 1627];
const L = lightBg;

function row(label, v1, v2, v3, v4, bg) {
  const ok = (t, w, b) => {
    const color = t === "✓" || t === "✔" ? "4CAF50" : t === "—" ? "999999" : darkColor;
    return c(t, w, { center: true, color, bg: b });
  };
  return new TableRow({ children: [
    c(label, W[0], { bold: true, bg }), ok(v1, W[1], bg), ok(v2, W[2], bg), ok(v3, W[3], bg), ok(v4, W[4], bg)
  ]});
}

const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 22, color: darkColor } } } },
  numbering: { config: [{ reference: "bullets",
    levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
  sections: [{
    properties: {
      page: { size: { width: 11906, height: 16838 }, margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } }
    },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: "SUVARNA ", bold: true, font: "Arial", size: 18, color: accentColor }),
        new TextRun({ text: "| iamsuvarna.ru", font: "Arial", size: 18, color: "999999" })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "SUVARNA — Техническое сопровождение  |  Стр. ",
        font: "Arial", size: 16, color: "999999" }),
        new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "999999" })] })] }) },
    children: [
      gap(400),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
        children: [new TextRun({ text: "SUVARNA", bold: true, font: "Arial", size: 52, color: accentColor })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
        children: [new TextRun({ text: "Дизайнерская одежда с индийским наследием",
          font: "Arial", size: 22, color: "999999", italics: true })] }),
      gap(200),
      new Paragraph({ alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 2, color: accentColor, space: 8 },
                  bottom: { style: BorderStyle.SINGLE, size: 2, color: accentColor, space: 8 } },
        spacing: { before: 100, after: 100 },
        children: [
          new TextRun({ text: "ТАРИФНЫЙ ПЛАН", bold: true, font: "Arial", size: 36, color: darkColor }),
          new TextRun({ text: "\nТехническое сопровождение сайта iamsuvarna.ru",
            font: "Arial", size: 22, color: "666666", break: 1 })
        ] }),
      gap(400),

      secTitle("О проекте"),
      new Paragraph({ spacing: { after: 120 }, children: [
        new TextRun({ text: "SUVARNA — интернет-магазин премиальной дизайнерской одежды с индийским текстильным наследием.", font: "Arial", size: 22 })
      ]}),
      bullet("Стек: React + Node.js + PostgreSQL + Docker + Caddy"),
      bullet("Админ-панель: Mantine UI, TanStack Query"),
      bullet("Оплата: ЮКасса, Cloudflare CDN"),
      bullet("Домен: iamsuvarna.ru"),
      gap(100),

      secTitle("Тарифы"),
      gap(100),
      new Table({
        width: { size: 9506, type: WidthType.DXA }, columnWidths: W,
        rows: [
          new TableRow({ children: [hCell("", W[0]), hCell("Базовый", W[1]), hCell("Стандарт", W[2]), hCell("Премиум", W[3]), hCell("Разово", W[4])] }),
          row("Стоимость / мес.", "15 000 ₽", "30 000 ₽", "55 000 ₽", "от 3 000 ₽", L),
          row("Часы работы", "до 5 ч", "до 12 ч", "до 25 ч", "по задаче"),
          row("Время реакции", "до 48 ч", "до 24 ч", "до 4 ч", "до 72 ч", L),
          row("Исправление ошибок", "✓", "✓", "✓", "✓"),
          row("Обновление контента", "✓", "✓", "✓", "✓", L),
          row("Мелкие правки UI/UX", "✓", "✓", "✓", "✓"),
          row("Новые функции", "—", "✓", "✓", "✓", L),
          row("SEO-оптимизация", "—", "базовая", "расширенная", "по запросу"),
          row("Мониторинг", "—", "✓", "✓", "—", L),
          row("Резервное копирование", "еженед.", "еженед.", "еженед.", "—"),
          row("Администрирование сервера", "✓", "✓", "✓", "—", L),
          row("Приоритетная поддержка", "—", "—", "✓", "—"),
        ]
      }),
      gap(300),

      secTitle("Описание тарифов"),
      ...tariffDesc("Базовый — 15 000 ₽/мес.",
        "Поддержка работоспособности сайта и оперативное исправление ошибок. Подходит для стабильно работающего сайта без частых изменений. Включает до 5 часов работы, баг-фиксы, обновление контента, бэкапы и администрирование сервера."),
      ...tariffDesc("Стандарт — 30 000 ₽/мес.",
        "Активное развитие сайта: новые функции, улучшение UI/UX, базовая SEO-оптимизация. До 12 часов работы, мониторинг, время реакции до 24 часов. Оптимальный выбор для растущего бизнеса."),
      ...tariffDesc("Премиум — 55 000 ₽/мес.",
        "Полное сопровождение и приоритетная поддержка. До 25 часов работы, время реакции до 4 часов, расширенная SEO-оптимизация, новые функции. Для проектов с высокими требованиями."),
      ...tariffDesc("Разовые работы — от 3 000 ₽",
        "Оплата по факту за конкретную задачу. Подходит для разовых доработок, когда подписка не требуется. Стоимость оценивается индивидуально."),
      gap(300),

      secTitle("Примеры работ"),
      new Table({
        width: { size: 9506, type: WidthType.DXA }, columnWidths: [5506, 2000, 2000],
        rows: [
          new TableRow({ children: [hCell("Задача", 5506), hCell("Срок", 2000), hCell("Стоимость", 2000)] }),
          new TableRow({ children: [c("Исправить ошибку отображения / верстки", 5506), c("1–2 дня", 2000, {center:true}), c("3 000 ₽", 2000, {center:true})] }),
          new TableRow({ children: [c("Добавить новую коллекцию / раздел", 5506, {bg:L}), c("1–3 дня", 2000, {center:true,bg:L}), c("5 000 ₽", 2000, {center:true,bg:L})] }),
          new TableRow({ children: [c("Интеграция сервиса (аналитика, CRM)", 5506), c("3–5 дней", 2000, {center:true}), c("10 000–15 000 ₽", 2000, {center:true})] }),
          new TableRow({ children: [c("Редизайн страницы / блока", 5506, {bg:L}), c("2–5 дней", 2000, {center:true,bg:L}), c("8 000–20 000 ₽", 2000, {center:true,bg:L})] }),
          new TableRow({ children: [c("Настройка Cloudflare / DNS / SSL", 5506), c("1 день", 2000, {center:true}), c("3 000–5 000 ₽", 2000, {center:true})] }),
        ]
      }),
      gap(300),

      secTitle("Контакты"),
      new Paragraph({ spacing: { after: 60 }, children: [
        new TextRun({ text: "Для выбора тарифа или обсуждения задач свяжитесь с нами:", font: "Arial", size: 20 })
      ]}),
      bullet("Telegram: @oza_fashion"),
      bullet("Телефон: +7 911 495 94 75"),
      gap(200),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 },
        border: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 8 } },
        children: [new TextRun({ text: "© 2024–2026 SUVARNA. Все права защищены.",
          font: "Arial", size: 18, color: "999999", italics: true })] }),
    ]
  }]
});

const outPath = process.argv[2];
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log("Created: " + outPath);
});
