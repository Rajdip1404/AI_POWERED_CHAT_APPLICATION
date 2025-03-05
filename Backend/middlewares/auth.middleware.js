import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticateUser = async (req, res, next) => {

  const token = req.cookies.token;
  if(!token) return res.status(401).json({ 
    success: false,
    message: "Unauthorized: No token provided" 
  });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded) return res.status(401).json({ 
      success: false,
      message: "Unauthorized: Invalid token" 
    });

    // Find user by email instead of findById
    const user = await User.findOne({ email: decoded.email }).select(
      "-password"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user; // Attach user object to request
    next();
    
  } 
  catch (error) {
    return res
      .status(403)
      .json({ message: "Forbidden: Invalid or expired token" });
  }
};
