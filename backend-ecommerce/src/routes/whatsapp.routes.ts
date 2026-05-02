import { Router } from "express";
import { createWhatsAppIntent } from "../controllers/whatsapp.controller";

const router = Router();

router.post("/intents", createWhatsAppIntent);

export default router;
