import { Router } from "express";
import { createPacking, GetAllPacking } from "./packing.controller.js";

const route = Router();

route.post("/create-packing", createPacking);

route.get("/get-all-packing", GetAllPacking);

export const PackingRoute = route;
