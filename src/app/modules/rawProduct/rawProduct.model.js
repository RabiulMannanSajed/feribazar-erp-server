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

    itemCost: {
      type: Number,
    },

    // * If goods
    itemWeight: {
      type: Number,
    },

    // * If packing
    itemNumber: {
      type: Number,
    },

    weightUnit: {
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

    batchNumber: {
      type: String,
      required: true,
      trim: true,
    },

    //* this one come form the processing product and other part
    afterUseRawItemWeight: {
      type: Number,
      default: null,
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
  console.log(this);
  this.rawProductPricePerKg = calculateRawProductPricePerKg(this);
  next();
});

// 🔹 Pre-update hook (when updating existing)
RawProductSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  // Fetch the existing document
  const docToUpdate = await this.model.findOne(this.getQuery());

  if (!docToUpdate) return next();

  // Merge old + new values
  const updatedData = { ...docToUpdate.toObject(), ...update };

  // Recalculate
  update.rawProductPricePerKg = calculateRawProductPricePerKg(updatedData);

  this.setUpdate(update);

  next();
});

export const RawProduct = model("RawProduct", RawProductSchema);
