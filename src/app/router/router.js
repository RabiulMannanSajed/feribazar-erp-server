import { Router } from "express";
import { RawProductRoute } from "../modules/rawProduct/rawProduct.route.js";
import { ProcessingRoute } from "../modules/processing/Processing.route.js";
import { MixingRoute } from "../modules/mixing/mixing.route.js";

const router = Router();

const moduleRouters = [
  {
    path: "/raw-product",
    route: RawProductRoute,
  },

  {
    path: "/processing-product",
    route: ProcessingRoute,
  },

  {
    path: "/mixing-product",
    route: MixingRoute,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));

export default router;
