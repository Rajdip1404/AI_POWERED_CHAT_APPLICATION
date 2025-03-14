import User from "../models/user.model.js";
import userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendSuccessResetPasswordEmail,
} from "../services/emails.service.js";
import jwt from "jsonwebtoken";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // 🛑 Delete any existing unverified user with this email before creating a new one
    await User.deleteOne({
      email: req.body.email,
      isVerified: false,
      verificationTokenExpiresAt: { $lt: Date.now() },
    });

    const user = await userService.createUser(req, res);
    if (user) {
      await user.save();

      await sendVerificationEmail(user.email, user.verificationToken);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    }
  } catch (error) {
    if (!res.headersSent) {
      // prevents multiple responses
      return res.status(500).json({ message: error.message });
    }
  }
};

export const verifyEmailController = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    const token = user.generateJWT(res);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
      token, // Also returning for client-side storage if needed
    });

    await sendWelcomeEmail(user.email, user.name);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = await user.generateJWT(res);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        ...user._doc,
        password: undefined,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const profileController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized, please log in" });
    }

    res.status(200).json({
      success: true,
      user: {
        ...req.user._doc,
        password: undefined, // Don't expose password
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = user.generateResetPasswordToken();

    await user.save();

    // Send reset password email
    await sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
      token: resetToken,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPasswordController = async (req, res) => {
  const { resetToken } = req.params;

  try {
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expires Reset token",
      });
    }

    const hashedPassword = await User.hashPassword(password);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;

    await user.save();
    await sendSuccessResetPasswordEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyToken = async (token) => {
  try {
    if (!token) {
      throw new Error("Unauthorized - No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new Error("Unauthorized - Invalid token");
    }

    const user = await User.findOne({ email: decoded.email }).select(
      "-password"
    );
    if (!user) {
      throw new Error("User not found");
    }

    return user; // ✅ Return user object if valid
  } catch (error) {
    throw new Error(error.message || "Unauthorized");
  }
};


export const checkAuthController = async (req, res) => {
  try {
    const token = req.cookies?.token; // ✅ Check if token exists in cookies
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No token provided" });
    }

    const user = await verifyToken(token); // ✅ Use verifyToken function
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in checkAuth:", error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const loggedInUser = await User.findOne({ email: req.user.email });
    const allUsers = await userService.getAllUsers({ userId: loggedInUser._id });
    res.json({ message: "All users retrieved successfully", allUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserIdsByEmails = async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: "Emails array is required" });
    }

    // 🔹 Find users in DB
    const users = await User.find({ email: { $in: emails } }).select("_id");

    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json({ userIds: users.map((user) => user._id) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
