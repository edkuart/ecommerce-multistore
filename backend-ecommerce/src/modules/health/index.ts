import healthRoutes from "./health.routes";
import type { ApiModule } from "../../shared/http/api-module";

export const healthModule: ApiModule = {
  name: "health",
  path: "/",
  router: healthRoutes,
};
