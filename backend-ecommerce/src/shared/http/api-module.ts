import type { Router } from "express";

export type ApiModule = {
  name: string;
  path: string;
  router: Router;
};
