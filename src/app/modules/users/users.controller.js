import { createUseIntoDB } from "./users.services.js";

export const createUsers = async (req, res) => {
  try {
    const result = await createUseIntoDB(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: err.message });
  }
};
