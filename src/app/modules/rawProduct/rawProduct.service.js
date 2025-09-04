import { RawProduct } from "./rawProduct.model.js";

export const createRawProductIntoDB = async (data) => {
  // Logic to save raw product data into the database
  const rawProduct = await RawProduct(data);
  return await rawProduct.save();
};
