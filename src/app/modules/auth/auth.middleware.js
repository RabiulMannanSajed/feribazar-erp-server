import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const authMiddleware = (req, res, next) => {
  // 1. Try reading from Authorization header
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2. If not in header, try reading from cookie
  if (!token && req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, config.jwt_access_secret);
    req.user = decoded; // store payload
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
