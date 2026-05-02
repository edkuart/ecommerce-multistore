import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrders,
} from "../controllers/order.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/", createOrder);
router.get("/", requireAuth(["admin", "seller"]), getOrders);
router.get("/:id", requireAuth(["admin", "seller"]), getOrderById);

export default router;
