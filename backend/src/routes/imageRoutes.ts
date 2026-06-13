import { Router } from "express";
import { getImageById, getCollectionImageById } from "../controllers/imageController.js";

const router = Router();

router.get("/collection/:id", getCollectionImageById);
router.get("/:id", getImageById);

export default router;
