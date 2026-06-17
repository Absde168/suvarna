import { Router } from "express";
import { upload, setPageImage, deletePageImage, listPageImages } from "../controllers/pageImageController.js";

const router = Router();

router.get("/", listPageImages);
router.post("/:key", upload.single("image"), setPageImage);
router.delete("/:key", deletePageImage);

export default router;
