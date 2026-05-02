import type { Express } from "express";
import type { ApiModule } from "./api-module";

export function registerApiModules(app: Express, modules: ApiModule[]): void {
  for (const module of modules) {
    app.use(module.path, module.router);
  }
}
