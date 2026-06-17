import { Router } from "express";
import { upload, setPageImage, deletePageImage, listPageImages } from "../controllers/pageImageController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

router.get("/", listPageImages);
router.post("/:key", upload.single("image"), setPageImage);
router.delete("/:key", deletePageImage);

export default router;
