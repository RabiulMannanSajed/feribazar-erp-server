import { MixingProduct } from "./mixing.model.js";

// ✅ Create Mixing
export const createMixingIntoDB = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const mixingDoc = new MixingProduct(data);
    await mixingDoc.save({ session });

    // Update stock from raw/processing products
    await updateProductsForMixing(mixingDoc, session);

    await session.commitTransaction();
    session.endSession();

    return mixingDoc;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// ✅ Update Mixing
export const updateMixingIntoDB = async (id, data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const mixingDoc = await MixingProduct.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      session,
    });

    if (!mixingDoc) throw new Error("Mixing product not found");

    // Update stock again if changed
    await updateProductsForMixing(mixingDoc, session);

    await session.commitTransaction();
    session.endSession();

    return mixingDoc;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// ✅ Get all Mixing
export const getAllMixingsFromDB = async () => {
  return await MixingProduct.find().populate(
    "productAdded.idOfTheAddedProduct"
  );
};

// ✅ Get one Mixing
export const getMixingByIdFromDB = async (id) => {
  return await MixingProduct.findById(id).populate(
    "productAdded.idOfTheAddedProduct"
  );
};

// ✅ Delete Mixing
export const deleteMixingFromDB = async (id) => {
  return await MixingProduct.findByIdAndDelete(id);
};
