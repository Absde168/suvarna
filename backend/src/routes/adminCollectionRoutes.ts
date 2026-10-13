import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import {
  getAdminCollections,
  createAdminCollection,
  updateAdminCollection,
  deleteAdminCollection,
  setCollectionImage,
  deleteCollectionImage,
} from "../controllers/adminCollectionController.js";
import { reorderCollections } from "../controllers/collectionController.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

router.use(requireAuth);

router.get("/", getAdminCollections);
router.post("/", createAdminCollection);
router.put("/reorder", reorderCollections);
router.put("/:id", updateAdminCollection);
router.delete("/:id", deleteAdminCollection);

router.put("/:id/image", upload.single("image"), setCollectionImage);
router.delete("/:id/image", deleteCollectionImage);

export default router;
