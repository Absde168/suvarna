import { Router } from "express";
import { getCollections, getCollectionBySlug, reorderCollections } from "../controllers/collectionController.js";

const router = Router();

router.get("/", getCollections);
router.put("/reorder", reorderCollections);
router.get("/:slug", getCollectionBySlug);

export default router;
