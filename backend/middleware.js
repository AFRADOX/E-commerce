import jwt from "jsonwebtoken";
import User from "./User.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    
    // Get full user data including shopName
    const user = await User.findById(decoded.id).select("-password");
    
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      shopName: user.shopName
    };
    
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access only" });

  next();
};