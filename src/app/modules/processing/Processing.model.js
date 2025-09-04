// here we will take the value of raw product and calculate the price per kg
import { model, Schema } from "mongoose";

const ProcessingSchema = new Schema({
  rawProduct: {
    // reference to raw product
    type: Schema.Types.ObjectId,
    ref: "RawProduct",
    required: true,
  },
  processedItemName: {
    type: String,
    required: true,
    trim: true,
  },

  //*  here user give the product
  processedItemWeight: {
    type: Number,
    required: true,
  },

  processedItemWeightUnit: {
    type: String,
    enum: ["kg", "mon", "ton", "piece"],
    required: true,
  },

  transportationCost: {
    type: [Number],
    default: [],
  },

  workerCost: {
    type: [Number],
    default: [],
  },

  otherCost: {
    type: [Number],
    default: [],
  },

  processingCost: {
    type: Number,
    required: true,
  },
});

export const Processing = model("Processing", ProcessingSchema);
