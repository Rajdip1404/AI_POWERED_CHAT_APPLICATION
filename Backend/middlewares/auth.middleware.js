import { verifyToken } from "../controllers/user.controller.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    req.user = await verifyToken(token); // ✅ Reuse verifyToken function

    next(); // ✅ Move to next middleware
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Invalid or expired token" });
  }
};
