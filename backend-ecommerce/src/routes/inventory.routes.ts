import { Router } from "express";
import {
  createInventoryMovement,
  exportInventoryMovements,
  getInventoryMetrics,
  getInventoryMovements,
  getInventorySalesByDay,
  getInventoryTopProducts,
} from "../controllers/inventory.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/metrics", requireAuth(["admin", "seller"]), getInventoryMetrics);
router.get(
  "/metrics/sales-by-day",
  requireAuth(["admin", "seller"]),
  getInventorySalesByDay,
);
router.get(
  "/metrics/top-products",
  requireAuth(["admin", "seller"]),
  getInventoryTopProducts,
);
router.get("/export", requireAuth(["admin", "seller"]), exportInventoryMovements);
router.get("/movements", requireAuth(["admin", "seller"]), getInventoryMovements);
router.post("/movements", requireAuth(["admin", "seller"]), createInventoryMovement);

export default router;
