import inventoryRoutes from "../../routes/inventory.routes";
import type { ApiModule } from "../../shared/http/api-module";

export const inventoryModule: ApiModule = {
  name: "inventory",
  path: "/inventory",
  router: inventoryRoutes,
};
