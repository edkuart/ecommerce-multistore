import productRoutes from "../../routes/product.routes";
import type { ApiModule } from "../../shared/http/api-module";

export const productsModule: ApiModule = {
  name: "products",
  path: "/products",
  router: productRoutes,
};
