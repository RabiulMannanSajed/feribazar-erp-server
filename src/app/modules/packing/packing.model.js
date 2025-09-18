import { Schema, model } from "mongoose";

const PackingSchema = new Schema(
  {
    workerCost: { type: [Number], default: [] },
    otherCost: { type: [Number], default: [] },
    transportationCost: { type: [Number], default: [] },

    packingMaterial: {
      idOfPackingMaterial: {
        type: Schema.Types.ObjectId,
        ref: "RawProduct",
        required: true,
      },
      materialName: { type: String, required: true },
      usedQuantity: { type: Number, required: true },
      unit: {
        type: String,
        enum: ["piece", "kg", "gm", "mon", "ton"],
        default: "piece", // ✅ bottles/jars usually countable
      },
    },

    packedProduct: {
      idOfProduct: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      productModel: {
        type: String,
        enum: ["MixingProduct", "Processing"],
        required: true,
      },
      productName: { type: String, required: true },
      mixingProductPricePerGm: { type: Number, required: true },
      weightPerBottle: { type: Number, required: true },
      weightUnit: {
        type: String,
        enum: ["gm", "kg"],
        default: "gm", // ✅ by default bottle weight is given in grams
      },
    },

    totalBottles: { type: Number, required: true },
    perBottlePackingCost: { type: Number, default: 0 },
    perBottleFinalCost: { type: Number, default: 0 },

    stock: [
      {
        weightPerBottle: Number,
        quantity: Number,
        perBottlePrice: Number,
      },
    ],
  },
  { timestamps: true }
);

export const Packing = model("Packing", PackingSchema);
