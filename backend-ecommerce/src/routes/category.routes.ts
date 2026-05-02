import { Router } from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller";
import { optionalAuth, requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", optionalAuth(), getCategories);
router.post("/", requireAuth(["admin", "seller"]), createCategory);
router.put("/:id", requireAuth(["admin", "seller"]), updateCategory);

export default router;
