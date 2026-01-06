import { createPackingIntoDB, GetAllPackingFromDB } from "./packing.service.js";

export const createPacking = async (req, res) => {
  try {
    const result = await createPackingIntoDB(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const GetAllPacking = async (req, res) => {
  try {
    const packingList = await GetAllPackingFromDB();
    res.status(200).json({ success: true, data: packingList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
