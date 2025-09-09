import { Processing } from "../src/app/modules/processing/Processing.model.js";
import { RawProduct } from "../src/app/modules/rawProduct/rawProduct.model.js";
import { convertToKg } from "./weightUtils.js";

// Update weights for multiple products inside Mixing
export const updateProductsForMixing = async (mixingDoc, session) => {
  for (const item of mixingDoc.productAdded) {
    const usedKg = convertToKg(item.AddedProductWeight, item.weightUnit);

    // 1️⃣ Check if product exists in RawProduct
    let product = await RawProduct.findById(item.idOfTheAddedProduct).session(
      session
    );

    if (product) {
      const rawKg = convertToKg(product.itemWeight, product.weightUnit);
      const remaining = rawKg - usedKg;

      if (remaining < 0) {
        throw new Error(
          `❌ Not enough stock for raw product: ${product.itemName}`
        );
      }

      product.afterUseRawItemWeight = remaining;
      await product.save({ session });
      continue;
    }

    // 2️⃣ Else check in ProcessingProduct
    product = await Processing.findById(item.idOfTheAddedProduct).session(
      session
    );

    if (product) {
      const processedKg = convertToKg(product.itemWeight, product.weightUnit);
      const remaining = processedKg - usedKg;

      if (remaining < 0) {
        throw new Error(
          `❌ Not enough stock for processed product: ${product.productName}`
        );
      }

      product.afterUseWeight = remaining;
      await product.save({ session });
      continue;
    }

    // 3️⃣ If product not found in either collection
    throw new Error(
      `❌ Product with ID ${item.idOfTheAddedProduct} not found in Raw or Processing`
    );
  }
};
