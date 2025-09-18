import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  role: {
    type: String,
    enum: [
      "admin",
      "manager",
      "processing_manager",
      "packaging_manager",
      "marketing_manager",
      "sales_representative",
    ],
  },
});

export const User = model("User", UserSchema);
