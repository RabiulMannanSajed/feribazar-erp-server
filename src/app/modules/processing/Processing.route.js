// routes/processing.routes.js
import express from "express";
import {
  createProcessing,
  deleteProcessing,
  getAllProcessing,
  getProcessingById,
  updateProcessing,
} from "./processing.controller.js";

const route = express.Router();

route.post("/create-processing-item", createProcessing);

route.get("/get-all-processing-item", getAllProcessing);

route.get("/get-processing-item/:id", getProcessingById);

route.patch("/updated-processing-item/:id", updateProcessing);

route.delete("/:id", deleteProcessing);

export const ProcessingRoute = route;
