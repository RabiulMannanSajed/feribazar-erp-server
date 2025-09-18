import { Router } from "express";
import { RawProductRoute } from "../modules/rawProduct/rawProduct.route.js";
import { ProcessingRoute } from "../modules/processing/Processing.route.js";
import { MixingRoute } from "../modules/mixing/mixing.route.js";
import { PackingRoute } from "../modules/packing/packing.route.js";
import { UserRoute } from "../modules/users/users.route.js";
import { AuthRoute } from "../modules/auth/auth.route.js";

const router = Router();

const moduleRouters = [
  {
    path: "/auth",
    route: AuthRoute,
  },

  {
    path: "/user",
    route: UserRoute,
  },

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

  {
    path: "/packing-product",
    route: PackingRoute,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));

export default router;
