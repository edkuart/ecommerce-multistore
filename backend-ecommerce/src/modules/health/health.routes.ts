import { Router } from "express";
import { sequelize } from "../../models";

const router = Router();

router.get("/healthz", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "backend-ecommerce",
    uptime: process.uptime(),
  });
});

router.get("/readyz", async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: "ready",
      service: "backend-ecommerce",
      database: "ok",
    });
  } catch {
    res.status(503).json({
      status: "not_ready",
      service: "backend-ecommerce",
      database: "unavailable",
    });
  }
});

export default router;
