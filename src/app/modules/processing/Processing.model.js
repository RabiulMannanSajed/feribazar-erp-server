import { model, Schema } from "mongoose";
import { calculateProcessProductPricePerKg } from "../../../../util/calculateProcessProductPricePerKg.js";

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

  itemType: {
    type: String,
    enum: ["packing", "goods"],
  },

  itemCost: {
    type: Number,
    required: true,
  },

  //*  here user give the product
  itemWeight: {
    type: Number,
    required: true,
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

  itemAmount: {
    type: Number,
  },

  cookingIngredientsCost: {
    type: [Number],
    default: [],
  },

  fuelCost: {
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

  //* this one come form the Mixing product and other part
  afterUseRawItemWeight: {
    type: Number,
    default: null,
  },

  ProcessingProductPricePerKg: {
    type: Number,
    default: null, // will be calculated automatically
  },
});

// 🔹 Pre-save middleware to set rawProductPricePerKg
ProcessingProductSchema.pre("save", function (next) {
  console.log("this here process food ", this);
  this.ProcessingProductPricePerKg = calculateProcessProductPricePerKg(this);
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
  update.ProcessingProductPricePerKg =
    calculateProcessProductPricePerKg(updatedData);

  this.setUpdate(update);

  next();
});

export const Processing = model("Processing", ProcessingProductSchema);
