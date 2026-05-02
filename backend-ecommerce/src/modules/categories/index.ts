import categoryRoutes from "../../routes/category.routes";
import type { ApiModule } from "../../shared/http/api-module";

export const categoriesModule: ApiModule = {
  name: "categories",
  path: "/categories",
  router: categoryRoutes,
};
