import { createRawProductIntoDB } from "./rawProduct.service.js";

export const createRawProduct = async (req, res) => {
  try {
    const product = await createRawProductIntoDB(req.body);
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//  here for the update if user can update any thing of the entry product
