import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import {
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  addProductImage,
  deleteProductImage,
  reorderProductImages,
} from "../controllers/adminProductController.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

router.use(requireAuth);

router.get("/", getAdminProducts);
router.get("/:id", getAdminProductById);
router.post("/", createAdminProduct);
router.put("/:id", updateAdminProduct);
router.delete("/:id", deleteAdminProduct);

router.post("/:id/images", upload.single("image"), addProductImage);
router.delete("/:id/images/:imageId", deleteProductImage);
router.put("/:id/images/reorder", reorderProductImages);

export default router;
