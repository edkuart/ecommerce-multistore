import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import { optionalAuth, requireAuth } from "../middleware/auth";
import { uploadProductImages } from "../middleware/upload";

const router = Router();

router.get("/", optionalAuth(), getProducts);
router.get("/:id", optionalAuth(), getProductById);
router.post("/", requireAuth(["admin", "seller"]), uploadProductImages.array("images", 5), createProduct);
router.put("/:id", requireAuth(["admin", "seller"]), uploadProductImages.array("images", 5), updateProduct);
router.delete("/:id", requireAuth(["admin", "seller"]), deleteProduct);

export default router;
