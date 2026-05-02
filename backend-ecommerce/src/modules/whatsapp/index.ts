import whatsappRoutes from "../../routes/whatsapp.routes";
import type { ApiModule } from "../../shared/http/api-module";

export const whatsappModule: ApiModule = {
  name: "whatsapp",
  path: "/whatsapp",
  router: whatsappRoutes,
};
