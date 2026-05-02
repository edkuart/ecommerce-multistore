import "./config/env";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { env } from "./config/env";
import { apiModules } from "./modules";
import { errorMiddleware } from "./shared/http/error.middleware";
import { notFoundMiddleware } from "./shared/http/not-found.middleware";
import { registerApiModules } from "./shared/http/register-modules";
import "./models";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

registerApiModules(app, apiModules);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
