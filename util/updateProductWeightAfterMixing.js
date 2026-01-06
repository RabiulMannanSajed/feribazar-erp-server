import mongoose from "mongoose";
import { RawProduct } from "../src/app/modules/rawProduct/rawProduct.model.js";
import { Processing } from "../src/app/modules/processing/Processing.model.js";

// Convert weight to KG always
const convertToKg = (weight, unit) => {
  switch (unit) {
    case "kg":
      return weight;
    case "gm":
      return weight / 1000;
    case "mon":
      return weight * 40; // 1 mon = 40 kg
    case "ton":
      return weight * 1000;
    default:
      return weight;
  }
};

export const updateProductWeightAfterMixing = async (mixingProduct) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    for (const added of mixingProduct.productAdded) {
      const usedKg = convertToKg(added.AddedProductWeight, added.weightUnit);

      if (added.productModel === "RawProduct") {
        const raw = await RawProduct.findById(
          added.idOfTheAddedProduct
        ).session(session);
        if (!raw) continue;

        raw.afterUseRawItemWeight =
          (raw.afterUseRawItemWeight ?? raw.itemWeight) - usedKg;

        if (raw.afterUseRawItemWeight < 0) {
          throw new Error(`RawProduct ${raw.itemName} stock is insufficient!`);
        }

        await raw.save({ session });
      }

      if (added.productModel === "Processing") {
        const proc = await Processing.findById(
          added.idOfTheAddedProduct
        ).session(session);
        if (!proc) continue;

        proc.afterUseRawItemWeight =
          (proc.afterUseRawItemWeight ?? proc.itemWeight) - usedKg;

        if (proc.afterUseRawItemWeight < 0) {
          throw new Error(
            `Processing Product ${proc.processedItemName} stock is insufficient!`
          );
        }

        await proc.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    console.error(" Error updating product weight:", error);
    throw error;
  }
};
