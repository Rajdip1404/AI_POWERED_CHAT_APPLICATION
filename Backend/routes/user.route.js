import Router from "express";
import { createUserController, loginUserController, profileController, logoutController } from "../controllers/user.controller.js";
import { body } from "express-validator"
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", 
    
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    createUserController);

router.post("/login", 
    
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    loginUserController);

router.get("/profile", authUser, profileController);

router.get("/logout", authUser, logoutController);

export default router;