const { Router } = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post("/register", authController.registerController
);

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */

authRouter.post("/login", authController.loginController);

/**
 * @route GET /api/auth/logout
 * @description Logout a user
 * @access Public
 */

authRouter.get("/logout", authController.logoutController);

module.exports = authRouter;