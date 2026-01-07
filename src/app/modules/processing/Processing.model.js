import { model, Schema } from "mongoose";
import { calculateProcessProductPricePerKg } from "../../../../util/calculateProcessProductPricePerKg.js";

const ProcessingProductSchema = new Schema(
  {
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

    // here find the wastage product weight
    //this is the weight raw product taken for processing
    productWFromRaw: {
      type: Number,
      required: true,
    },

    //*  here user give the product weight after processing
    itemWeight: {
      type: Number,
      required: true,
    },

    // this value come form the productWFromRaw - itemWeight
    wastageProductWeight: {
      type: Number,
      default: 0,
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
  },
  { timestamps: true }
);

// 🔹 Pre-save middleware to set rawProductPricePerKg
ProcessingProductSchema.pre("save", function (next) {
  console.log("this here process food ", this);

  // 🔹 Calculate wastage
  this.wastageProductWeight = this.productWFromRaw - this.itemWeight;

  if (this.wastageProductWeight < 0) {
    return next(new Error("❌ Processed weight cannot exceed raw weight"));
  }

  // 🔹 Calculate price per KG
  this.ProcessingProductPricePerKg = calculateProcessProductPricePerKg(this);

  next();
});

// 🔹 Pre-update hook (when updating existing)
// ProcessingProductSchema.pre("findOneAndUpdate", async function (next) {
//   const update = this.getUpdate();

//   // Fetch the existing document
//   const docToUpdate = await this.model.findOne(this.getQuery());

//   if (!docToUpdate) return next();

//   // Merge old + new values
//   const updatedData = { ...docToUpdate.toObject(), ...update };

//   // Recalculate
//   update.ProcessingProductPricePerKg =
//     calculateProcessProductPricePerKg(updatedData);

//   this.setUpdate(update);

//   next();
// });

// TODO Check this part
ProcessingProductSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  // Get existing document
  const existingDoc = await this.model.findOne(this.getQuery());
  if (!existingDoc) return next();

  // Merge old + new values
  const mergedData = {
    ...existingDoc.toObject(),
    ...update.$set,
    ...update,
  };

  // 🔹 Recalculate wastage
  const wastage = mergedData.productWFromRaw - mergedData.itemWeight;

  if (wastage < 0) {
    return next(new Error("❌ Processed weight cannot exceed raw weight"));
  }

  // 🔹 Set recalculated values
  update.$set = {
    ...update.$set,
    wastageProductWeight: wastage,
    ProcessingProductPricePerKg: calculateProcessProductPricePerKg(mergedData),
  };

  this.setUpdate(update);
  next();
});

export const Processing = model("Processing", ProcessingProductSchema);
