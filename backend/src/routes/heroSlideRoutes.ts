import { Router } from "express";
import multer from "multer";
import { getHeroSlides, getHeroSlideImage } from "../controllers/heroSlideController.js";

const router = Router();

router.get("/", getHeroSlides);
router.get("/:id/image", getHeroSlideImage);

export default router;
