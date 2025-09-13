import {
  createMixingIntoDB,
  deleteMixingFromDB,
  getAllMixingsFromDB,
  getMixingByIdFromDB,
  updateMixingIntoDB,
} from "./mixing.service.js";

// ✅ Create Mixing
export const createMixing = async (req, res) => {
  try {
    const result = await createMixingIntoDB(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Update Mixing
export const updateMixing = async (req, res) => {
  try {
    const result = await updateMixingIntoDB(req.params.id, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Get all
export const getAllMixings = async (req, res) => {
  try {
    const result = await getAllMixingsFromDB();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Get one
export const getMixingById = async (req, res) => {
  try {
    const result = await getMixingByIdFromDB(req.params.id);
    if (!result)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Delete
export const deleteMixing = async (req, res) => {
  try {
    const result = await deleteMixingFromDB(req.params.id);
    if (!result)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
