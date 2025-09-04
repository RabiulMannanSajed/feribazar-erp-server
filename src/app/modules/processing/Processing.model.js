// here we will take the value of raw product and calculate the price per kg
import { model, Schema } from "mongoose";

const ProcessingProductSchema = new Schema({
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

  batchNumber: {
    type: String,
    required: true,
    trim: true,
  },

  processingCost: {
    type: Number,
    required: true,
  },
});

// 🔹 Pre-save middleware to set rawProductPricePerKg
ProcessingProductSchema.pre("save", function (next) {
  this.rawProductPricePerKg = calculateRawProductPricePerKg(this);
  next();
});

// 🔹 Pre-update hook (when updating existing)
ProcessingProductSchema.pre("findOneAndUpdate", async function (next) {
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

export const Processing = model("Processing", ProcessingProductSchema);
