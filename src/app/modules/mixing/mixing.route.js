import { Router } from "express";
import {
  createMixing,
  getAllMixingProducts,
  updateMixing,
} from "./mixing.controller.js";

const route = Router();

route.post("/create-mixing-product", createMixing);

route.get("/get-all-mixing-products", getAllMixingProducts);

route.patch("/update-mixing-product/:id", updateMixing);

export const MixingRoute = route;
