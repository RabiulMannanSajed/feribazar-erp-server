import {
  createProcessingService,
  deleteProcessingService,
  getAllProcessingService,
  getProcessingByIdService,
  updateProcessingService,
} from "./Processing.service.js";

// Create new processing product
export const createProcessing = async (req, res) => {
  try {
    const processing = await createProcessingService(req.body);
    res.status(201).json({ success: true, data: processing });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all
export const getAllProcessing = async (req, res) => {
  try {
    const processing = await getAllProcessingService();
    res.status(200).json({ success: true, data: processing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get by ID
export const getProcessingById = async (req, res) => {
  try {
    const processing = await getProcessingByIdService(req.params.id);
    if (!processing) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, data: processing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update
export const updateProcessing = async (req, res) => {
  try {
    const updated = await updateProcessingService(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete
export const deleteProcessing = async (req, res) => {
  try {
    const deleted = await deleteProcessingService(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
