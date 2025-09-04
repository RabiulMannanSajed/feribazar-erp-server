import { Router } from "express";
import { RawProductRoute } from "../modules/rawProduct/rawProduct.route.js";

const router = Router();

const moduleRouters = [
  {
    path: "/raw-product",
    route: RawProductRoute,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));

export default router;
