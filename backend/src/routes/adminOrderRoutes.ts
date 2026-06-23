import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  deleteAdminOrder,
} from "../controllers/adminOrderController.js";

const router = Router();

router.use(requireAuth);

router.get("/", getAdminOrders);
router.get("/:id", getAdminOrderById);
router.patch("/:id/status", updateAdminOrderStatus);
router.delete("/:id", deleteAdminOrder);

export default router;
