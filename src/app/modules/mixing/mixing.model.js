import { Schema, model } from "mongoose";
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
          ref: "ProcessingProduct",
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

    mixingProductPricePerGm: {
      type: Number,
    },
  },
  { timestamps: true }
);

mixingProductPricePerGm.pre("save", function (next) {
  this.mixingProductPricePerGm = calculateMixingProductPricePerGm(this);
  next();
});

export const MixingProduct = model("MixingProduct", MixingUnitSchema);
