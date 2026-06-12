import express from "express";
import { createServer } from "http";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Создаём таблицу товаров если не существует
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      article VARCHAR(100) UNIQUE NOT NULL,
      category VARCHAR(100),
      price INTEGER,
      quantity INTEGER DEFAULT 0,
      sizes TEXT[],
      images TEXT[],
      description TEXT,
      fabric VARCHAR(255),
      care VARCHAR(255),
      is_new BOOLEAN DEFAULT false,
      is_bestseller BOOLEAN DEFAULT false,
      in_stock BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Добавляем новые колонки если их нет
  try {
    await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS article VARCHAR(100)`);
    await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 0`);
  } catch (error) {
    console.log("Columns might already exist");
  }

  console.log("DB initialized");
}

// API endpoints
app.get("/api/products", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Товар не найден" });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { 
      name, article, category, price, quantity, 
      sizes, images, description, fabric, care, 
      is_new, is_bestseller, in_stock 
    } = req.body;

    // Валидация
    if (!name || !article || !price) {
      return res.status(400).json({ error: "Заполните обязательные поля: name, article, price" });
    }

    const result = await pool.query(
      `INSERT INTO products (
        name, article, category, price, quantity, 
        sizes, images, description, fabric, care, 
        is_new, is_bestseller, in_stock
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [
        name, article, category, price, quantity || 0,
        sizes || [], images || [], description || "", fabric || "", care || "",
        is_new || false, is_bestseller || false, in_stock !== undefined ? in_stock : true
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: "Артикул уже существует" });
    }
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, article, category, price, quantity,
      sizes, images, description, fabric, care, 
      is_new, is_bestseller, in_stock 
    } = req.body;

    const result = await pool.query(
      `UPDATE products SET 
        name=$1, article=$2, category=$3, price=$4, quantity=$5,
        sizes=$6, images=$7, description=$8, fabric=$9, care=$10,
        is_new=$11, is_bestseller=$12, in_stock=$13
       WHERE id=$14 RETURNING *`,
      [
        name, article, category, price, quantity || 0,
        sizes || [], images || [], description || "", fabric || "", care || "",
        is_new || false, is_bestseller || false, in_stock !== undefined ? in_stock : true,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Товар не найден" });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: "Артикул уже существует" });
    }
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM products WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Товар не найден" });
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 3000;
const server = createServer(app);

initDB().then(() => {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(console.error);