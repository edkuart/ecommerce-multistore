import leadRoutes from "../../routes/lead.routes";
import type { ApiModule } from "../../shared/http/api-module";

export const leadsModule: ApiModule = {
  name: "leads",
  path: "/leads",
  router: leadRoutes,
};
