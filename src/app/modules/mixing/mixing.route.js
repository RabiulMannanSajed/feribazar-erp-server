import { Router } from "express";
import { createMixing } from "./mixing.controller.js";

const route = Router();

route.post("/create-mixing-product", createMixing);

export const MixingRoute = route;
