import { Router } from "express";
import { createStore, getStores, updateStore } from "../controllers/store.controller";
import { optionalAuth, requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", optionalAuth(), getStores);
router.post("/", requireAuth(["admin", "seller"]), createStore);
router.put("/:id", requireAuth(["admin", "seller"]), updateStore);

export default router;
