import Router from "express";
import { createUserController, loginUserController, profileController, logoutController, verifyEmailController, forgotPasswordController, resetPasswordController } from "../controllers/user.controller.js";
import { body } from "express-validator"
import { authenticateUser } from "../middlewares/auth.middleware.js";


const router = Router();

router.post("/register",

    body("name")
        .isString()
        .withMessage("Name must be a string")
        .matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
        .withMessage(
        "Name can only contain letters, numbers, and underscores, and must not start with a number"
        )
        .isLength({ min: 3, max: 50 })
        .withMessage("Name must be between 3 and 50 characters long"),

    body("email").isEmail().withMessage("Invalid email format"),

    body("password")
        .isLength({ min: 6, max: 50 })
        .withMessage("Password must be at least 6 characters long"),

  createUserController
);

router.post("/login", 

    body('email')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .isLength({ min: 6, max: 50 })
        .withMessage('Password must be at least 6 characters long'),

    loginUserController
);

router.get("/profile", authenticateUser, profileController);

router.post("/logout", authenticateUser, logoutController);

router.post("/verify-email", verifyEmailController);

router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:resetToken", resetPasswordController);


export default router;