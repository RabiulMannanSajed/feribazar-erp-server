import mongoose from "mongoose";
import { RawProduct } from "../rawProduct/rawProduct.model.js";
import { Processing } from "./Processing.model.js";
import { updateRawProductWeight } from "../../../../util/weightUtils.js";

export const createProcessingService = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check if raw product exists
    const rawProduct = await RawProduct.findById(data.rawProduct).session(
      session
    );

    console.log("   rawProduct", rawProduct);
    if (!rawProduct) {
      throw new Error("❌ Raw product not found");
    }

    // 2. Check if processedItemName exists in rawProduct
    if (
      rawProduct.processedItems &&
      !rawProduct.processedItems.includes(data.processedItemName)
    ) {
      throw new Error(
        `❌ Processed item "${data.processedItemName}" does not exist in raw product`
      );
    }

    // 3. Create new processing product (pre("save") middleware runs here)
    const processing = new Processing(data);
    await processing.save({ session });

    // 4. Deduct weight and update raw product
    await updateRawProductWeight(rawProduct, processing, session);

    // 5. Commit
    await session.commitTransaction();
    session.endSession();

    return processing;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Get all processing products
export const getAllProcessingService = async () => {
  return await Processing.find().populate("rawProduct");
};

// Get single processing product by ID
export const getProcessingByIdService = async (id) => {
  return await Processing.findById(id).populate("rawProduct");
};

// Update processing product
export const updateProcessingService = async (id, data) => {
  return await Processing.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  }).populate("rawProduct");
};

// Delete processing product
export const deleteProcessingService = async (id) => {
  return await Processing.findByIdAndDelete(id);
};
