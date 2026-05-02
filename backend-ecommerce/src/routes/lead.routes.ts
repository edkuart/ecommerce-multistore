import { Router } from "express";
import { getLeads } from "../controllers/lead.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth(["admin", "seller"]), getLeads);

export default router;
