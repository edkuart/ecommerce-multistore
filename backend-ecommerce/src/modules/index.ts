import type { ApiModule } from "../shared/http/api-module";
import { authModule } from "./auth";
import { categoriesModule } from "./categories";
import { healthModule } from "./health";
import { inventoryModule } from "./inventory";
import { leadsModule } from "./leads";
import { ordersModule } from "./orders";
import { productsModule } from "./products";
import { storesModule } from "./stores";
import { whatsappModule } from "./whatsapp";

export const apiModules: ApiModule[] = [
  healthModule,
  authModule,
  storesModule,
  categoriesModule,
  productsModule,
  inventoryModule,
  whatsappModule,
  leadsModule,
  ordersModule,
];
