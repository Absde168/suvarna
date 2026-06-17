import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
} from "../controllers/adminOrderController.js";

const router = Router();

router.use(requireAuth);

router.get("/", getAdminOrders);
router.get("/:id", getAdminOrderById);
router.patch("/:id/status", updateAdminOrderStatus);

export default router;
