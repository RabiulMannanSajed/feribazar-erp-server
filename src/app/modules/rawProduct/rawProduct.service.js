import { RawProduct } from "./rawProduct.model.js";

export const createRawProductIntoDB = async (data) => {
  // Logic to save raw product data into the database
  const rawProduct = await RawProduct(data);
  return await rawProduct.save();
};

// Update a raw product by ID (auto recalculates price)
export const updateRawProductInDB = async (id, data) => {
  return await RawProduct.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  });
};
