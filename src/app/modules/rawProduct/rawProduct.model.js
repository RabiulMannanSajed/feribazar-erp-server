import { model, Schema } from "mongoose";
import { calculateRawProductPricePerKg } from "../../../../util/calculateRawProductPricePerKg.js";

// TODO batch number gen auto base on the item type add date if this on the same day then add 1 more to the last one

const RawProductSchema = new Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    itemType: {
      type: String,
      enum: ["packing", "goods"],
    },
    // * If goods
    itemWeight: {
      type: Number,
    },
    // * If packing
    itemAmount: {
      type: Number,
    },

    weightUnit: {
      type: String,
      enum: ["kg", "mon", "ton"],
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

    batchNumber: {
      type: String,
      required: true,
      trim: true,
    },

    rawProductPricePerKg: {
      type: Number,
      default: null, // will be calculated automatically
    },
  },
  { timestamps: true }
);

// 🔹 Pre-save middleware to set rawProductPricePerKg
RawProductSchema.pre("save", function (next) {
  this.rawProductPricePerKg = calculateRawProductPricePerKg(this);
  next();
});

export const RawProduct = model("RawProduct", RawProductSchema);
