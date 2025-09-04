import {
  createRawProductIntoDB,
  updateRawProductInDB,
} from "./rawProduct.service.js";

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

// Update
export const updateRawProduct = async (req, res) => {
  try {
    const product = await updateRawProductInDB(req.params.id, req.body);
    if (!product)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
