import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./prisma.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/images", imageRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
