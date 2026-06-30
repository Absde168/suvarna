import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { createAdminCategory, deleteAdminCategory } from "../controllers/adminCategoryController.js";

const router = Router();

router.post("/", requireAuth, createAdminCategory);
router.delete("/:id", requireAuth, deleteAdminCategory);

export default router;
