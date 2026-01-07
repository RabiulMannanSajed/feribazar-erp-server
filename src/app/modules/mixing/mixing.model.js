import { model, Schema } from "mongoose";
import { calculateMixingProductPricePerGm } from "../../../../util/calculateMixingProductPricePerGm.js";
import { updateProductWeightAfterMixing } from "../../../../util/updateProductWeightAfterMixing.js";

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
          enum: ["RawProduct", "Processing"],
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
MixingUnitSchema.pre("save", async function (next) {
  const { pricePerGram, produceMixingProduct, MixingProductWeightUnit } =
    calculateMixingProductPricePerGm(this);

  this.mixingProductPricePerGm = pricePerGram;
  this.produceMixingProduct = produceMixingProduct;
  this.MixingProductWeightUnit = MixingProductWeightUnit;
  // here find the productModel and then reduce the W of the product base on the  wUnite
  await updateProductWeightAfterMixing(this);

  next();
});

export const MixingProduct = model("MixingProduct", MixingUnitSchema);
