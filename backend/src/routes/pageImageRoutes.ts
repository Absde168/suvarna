import { Router } from "express";
import { getPageImage } from "../controllers/pageImageController.js";

const router = Router();
router.get("/:key", getPageImage);

export default router;
