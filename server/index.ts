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
      category VARCHAR(100),
      price INTEGER,
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
  console.log("DB initialized");
}

// API endpoints
app.get("/api/products", async (_req, res) => {
  const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
  res.json(result.rows);
});

app.post("/api/products", async (req, res) => {
  const { name, category, price, sizes, images, description, fabric, care, is_new, is_bestseller } = req.body;
  const result = await pool.query(
    `INSERT INTO products (name, category, price, sizes, images, description, fabric, care, is_new, is_bestseller)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [name, category, price, sizes, images, description, fabric, care, is_new, is_bestseller]
  );
  res.json(result.rows[0]);
});

app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category, price, sizes, images, description, fabric, care, is_new, is_bestseller, in_stock } = req.body;
  const result = await pool.query(
    `UPDATE products SET name=$1, category=$2, price=$3, sizes=$4, images=$5, description=$6, fabric=$7, care=$8, is_new=$9, is_bestseller=$10, in_stock=$11
     WHERE id=$12 RETURNING *`,
    [name, category, price, sizes, images, description, fabric, care, is_new, is_bestseller, in_stock, id]
  );
  res.json(result.rows[0]);
});

app.delete("/api/products/:id", async (req, res) => {
  await pool.query("DELETE FROM products WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

const port = process.env.PORT || 3000;
const server = createServer(app);

initDB().then(() => {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(console.error);