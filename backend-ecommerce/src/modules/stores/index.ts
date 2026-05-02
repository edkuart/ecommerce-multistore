import storeRoutes from "../../routes/store.routes";
import type { ApiModule } from "../../shared/http/api-module";

export const storesModule: ApiModule = {
  name: "stores",
  path: "/stores",
  router: storeRoutes,
};
