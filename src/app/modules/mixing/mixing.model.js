import { model, Schema } from "mongoose";
import { calculateMixingProductPricePerGm } from "../../../../util/calculateMixingProductPricePerGm.js";

const MixingUnitSchema = new Schema(
  {
    workerCost: {
      type: [Number],
      default: [],
    },

    otherCost: {
      type: [Number],
      default: [],
    },

    transportationCost: {
      type: [Number],
      default: [],
    },

    productAdded: [
      {
        idOfTheAddedProduct: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        productModel: {
          type: String,
          enum: ["RawProduct", "Processing"], // 🔥 which collection it belongs to
          required: true,
        },
        AddedProductName: {
          type: String,
          required: true,
        },
        AddedProductPricePerKg: {
          type: Number,
          required: true,
        },
        AddedProductWeight: {
          type: Number,
          required: true,
        },
        weightUnit: {
          type: String,
          enum: ["kg", "mon", "ton", "gm"],
          required: true,
        },
      },
    ],

    produceMixingProduct: {
      type: Number,
    },
    MixingProductWeightUnit: {
      type: String,
      enum: ["kg", "mon", "ton", "gm"],
    },

    mixingProductPricePerGm: {
      type: Number,
      default: null,
    },
  },

  { timestamps: true }
);

// ✅ Pre-save hook should be on the Schema, not the field
MixingUnitSchema.pre("save", function (next) {
  const { pricePerGram, produceMixingProduct, MixingProductWeightUnit } =
    calculateMixingProductPricePerGm(this);

  this.mixingProductPricePerGm = pricePerGram;
  this.produceMixingProduct = produceMixingProduct;
  this.MixingProductWeightUnit = MixingProductWeightUnit;

  next();
});

export const MixingProduct = model("MixingProduct", MixingUnitSchema);
