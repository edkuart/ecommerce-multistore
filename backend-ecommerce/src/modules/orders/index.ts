import orderRoutes from "../../routes/order.routes";
import type { ApiModule } from "../../shared/http/api-module";

export const ordersModule: ApiModule = {
  name: "orders",
  path: "/orders",
  router: orderRoutes,
};
