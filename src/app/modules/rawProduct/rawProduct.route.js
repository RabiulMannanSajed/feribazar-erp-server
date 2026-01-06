import { Router } from "express";
import {
  createRawProduct,
  GetAllRawProduct,
  updateRawProduct,
} from "./rawProduct.controller.js";

const route = Router();

route.get("/get-all-raw-product", GetAllRawProduct);

route.post("/create-raw-product", createRawProduct);

route.patch("/update-raw-product/:id", updateRawProduct);

export const RawProductRoute = route;
