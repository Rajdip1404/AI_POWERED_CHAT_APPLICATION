import User from "../models/user.model.js";
import crypto from "crypto";

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    if( !name || !email || !password) {
        throw new Error("All fields are required");
    }

    const userAlreadyExist = await User.findOne({email});
    if(userAlreadyExist) {
        return res.status(400).json({success: false, message: "User already exist"});
    }

    const hashedPassword = await User.hashPassword(password);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    
    const user = await User.create({ 
        name, 
        email, 
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    return user;
}

export const getAllUsers = async ({ userId }) => {
  const allUsers = await User.find({
    _id: { $ne: userId },
  });
  return allUsers;
};



export default { createUser, getAllUsers };