import { Router } from "express";
import { createDolyamePayment, handleDolyameNotification } from "../controllers/dolyameController.js";

const router = Router();

router.post("/create", createDolyamePayment);
router.post("/notify", handleDolyameNotification);

export default router;
