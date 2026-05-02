import authRoutes from "../../routes/auth.routes";
import type { ApiModule } from "../../shared/http/api-module";

export const authModule: ApiModule = {
  name: "auth",
  path: "/auth",
  router: authRoutes,
};
