import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./prisma.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import heroSlideRoutes from "./routes/heroSlideRoutes.js";
import adminHeroSlideRoutes from "./routes/adminHeroSlideRoutes.js";
import pageImageRoutes from "./routes/pageImageRoutes.js";
import adminPageImageRoutes from "./routes/adminPageImageRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import adminCollectionRoutes from "./routes/adminCollectionRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.get("/api/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/hero-slides", heroSlideRoutes);

app.use("/api/admin/auth", authRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/collections", adminCollectionRoutes);
app.use("/api/admin/hero-slides", adminHeroSlideRoutes);
app.use("/api/page-images", pageImageRoutes);
app.use("/api/admin/page-images", adminPageImageRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
