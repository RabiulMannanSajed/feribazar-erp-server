import { createPackingIntoDB } from "./packing.service.js";

export const createPacking = async (req, res) => {
  try {
    const result = await createPackingIntoDB(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
