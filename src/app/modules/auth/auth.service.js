import { User } from "../users/users.model.js";
import jwt from "jsonwebtoken";

export const LoginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  // TODO: Add password check here with bcrypt.compare()

  const payload = {
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, config.jwt_access_secret, {
    expiresIn: config.jwt_access_expires,
  });

  return { token, user: payload }; // ✅ only return, no res here
};
