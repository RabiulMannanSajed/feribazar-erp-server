import { Router } from "express";
import { createRawProduct } from "./rawProduct.controller.js";

const route = Router();

route.post("/create-raw-product", createRawProduct);

export const RawProductRoute = route;
