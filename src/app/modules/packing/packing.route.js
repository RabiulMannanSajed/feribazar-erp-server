import { Router } from "express";
import { createPacking } from "./packing.controller.js";

const route = Router();

route.post("/create-packing", createPacking);

export const PackingRoute = route;
