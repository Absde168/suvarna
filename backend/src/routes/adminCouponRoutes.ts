import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listAdminCoupons,
  createAdminCoupon,
  toggleAdminCoupon,
  deleteAdminCoupon,
} from "../controllers/adminCouponController.js";

const router = Router();

router.get("/", requireAuth, listAdminCoupons);
router.post("/", requireAuth, createAdminCoupon);
router.patch("/:id", requireAuth, toggleAdminCoupon);
router.delete("/:id", requireAuth, deleteAdminCoupon);

export default router;
