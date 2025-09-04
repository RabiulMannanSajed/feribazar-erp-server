import { Router } from "express";
import { createRawProduct, updateRawProduct } from "./rawProduct.controller.js";

const route = Router();

route.post("/create-raw-product", createRawProduct);

route.patch("/update-raw-product/:id", updateRawProduct);

export const RawProductRoute = route;
