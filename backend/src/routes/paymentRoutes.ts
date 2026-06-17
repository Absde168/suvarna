import { Router } from "express";
import { yokassaWebhook } from "../controllers/paymentController.js";

const router = Router();

router.post("/webhook", yokassaWebhook);

export default router;
