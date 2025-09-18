import mongoose from "mongoose";
import { calculatePackingCost } from "../../../../util/calculatePackingCost.js";
import { convertToKg } from "../../../../util/weightUtils.js";
import { MixingProduct } from "../mixing/mixing.model.js";
import { RawProduct } from "../rawProduct/rawProduct.model.js";
import { Packing } from "./packing.model.js";

export const createPackingIntoDB = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ✅ Calculate per bottle costs
    const { perBottlePackingCost, perBottleFinalCost } =
      calculatePackingCost(data);

    const stockWithPrices = data.stock.map((item) => {
      const productCost =
        item.weightPerBottle * data.packedProduct.mixingProductPricePerGm;
      const finalCost = productCost + perBottlePackingCost;
      return {
        ...item,
        perBottlePrice: finalCost, // ✅ new field
      };
    });

    const packingDoc = new Packing({
      ...data,
      perBottlePackingCost,
      perBottleFinalCost,
      stock: stockWithPrices,
    });
    await packingDoc.save({ session });

    const material = await RawProduct.findById(
      data.packingMaterial.idOfPackingMaterial
    ).session(session);

    if (!material) {
      throw new Error("Packing material not found!");
    }

    // Ensure numeric
    const currentStock = Number(
      material.afterUseRawItemWeight ?? material.itemNumber
    );
    const usedQty = Number(data.packingMaterial.usedQuantity);

    if (isNaN(currentStock) || isNaN(usedQty)) {
      throw new Error("Invalid stock or used quantity (NaN found)");
    }

    if (currentStock < usedQty) {
      throw new Error("Not enough packing material in stock!");
    }

    material.afterUseRawItemWeight = currentStock - usedQty;
    await material.save({ session });

    // ✅ Update product (Mixing or Processing stock)
    if (data.packedProduct.productModel === "MixingProduct") {
      const product = await MixingProduct.findById(
        data.packedProduct.idOfProduct
      ).session(session);

      if (!product) throw new Error("Mixing product not found!");

      const usedGm = data.totalBottles * data.packedProduct.weightPerBottle; // total gm used

      console.log("usedGm", usedGm);
      console.log("product.weight", product.produceMixingProduct);
      console.log("product.weightUnit", product.MixingProductWeightUnit);

      const availableKg = convertToKg(
        product.produceMixingProduct,
        product.MixingProductWeightUnit
      );
      if (usedGm / 1000 > availableKg) {
        throw new Error("Not enough product stock!");
      }

      product.afterUseWeight =
        (product.afterUseWeight || availableKg) - usedGm / 1000;
      await product.save({ session });
    } else if (data.packedProduct.productModel === "Processing") {
      const product = await Processing.findById(
        data.packedProduct.idOfProduct
      ).session(session);

      if (!product) throw new Error("Processing product not found!");

      const usedGm = data.totalBottles * data.packedProduct.weightPerBottle; // total gm used

      const availableKg = convertToKg(product.itemWeight, product.weightUnit);
      if (usedGm / 1000 > availableKg) {
        throw new Error("Not enough stock in processing product!");
      }

      product.afterUseWeight =
        (product.afterUseWeight || availableKg) - usedGm / 1000;
      await product.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return packingDoc;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
