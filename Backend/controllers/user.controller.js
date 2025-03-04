import User from "../models/user.model.js";
import userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendSuccessResetPasswordEmail } from "../services/emails.service.js";
import jwt from "jsonwebtoken";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userService.createUser(req, res);
    if (user) {
      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d", // Single long-lived token
      });

      // Set the token in an HttpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      await sendVerificationEmail(user.email, user.verificationToken);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          ...user._doc,
          password: undefined,
        },
        token,
      });
    }
  } catch (error) {
    if (!res.headersSent) { // prevents multiple responses
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Single long-lived token
    });

    // Set the token in an HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
      token, // Also returning for client-side storage if needed
    });

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);
  } 
  catch (error) {
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

    const token = await user.generateJWT();

    user.lastLogin = new Date();
    await user.save();

    // Set the token in an HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

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
  try{
    const user = await User.findOne({email});

    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const resetToken = user.generateResetPasswordToken();

    await user.save();

    // Send reset password email
    await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
      token: resetToken
    });
  }
  catch(error){
    res.status(400).json({message: error.message});
  }
};

export const resetPasswordController = async (req, res) => {
  const { resetToken } = req.params;

  try{
    const { password } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if(!user){
      return res.status(404).json({
        success: false,
        message: "Invalid or expires Reset token"
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
      message: "Password reset successfully"
    });

  }catch(error){
    res.status(400).json({message: error.message});
  }
};