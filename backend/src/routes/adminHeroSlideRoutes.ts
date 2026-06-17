import { Router } from "express";
import multer from "multer";
import {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  setHeroSlideImage,
  deleteHeroSlideImage,
} from "../controllers/heroSlideController.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

router.get("/", getHeroSlides);
router.post("/", createHeroSlide);
router.put("/:id", updateHeroSlide);
router.delete("/:id", deleteHeroSlide);
router.post("/:id/image", upload.single("image"), setHeroSlideImage);
router.delete("/:id/image", deleteHeroSlideImage);

export default router;
