import User from "../models/user.model.js";
import userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        const user = await userService.createUser(req.body);
        const token = await user.generateJWT();

        res.status(201).json({user, token});
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

export const loginUserController = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        const {email, password} = req.body;

        const user = await User.findOne({email}).select("+password");
        if(!user){
            return res.status(401).json({message: "User not found"});
        }

        const isValidPassword = await user.isValidPassword(password);
        if(!isValidPassword){
            return res.status(401).json({message: "Invalid password"});
        }

        const token = await user.generateJWT();
        res.status(200).json({user, token});
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}

export const profileController = async (req, res) => {
    console.log(req.user);

    res.status(200).json({ 
        user: req.user
    });
}

export const logoutController = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        redisClient.set(token, "logout", "EX", 60 * 60 * 24 * 2); // 2 days

        res.status(200).json({message: "Logout successful"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }

}