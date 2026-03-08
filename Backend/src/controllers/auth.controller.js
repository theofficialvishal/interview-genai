const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

/**
 * @name registerController
 * @description Register a new user
 * @route POST /api/auth/register
 * @access Public
 */

const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const isUserAlreadyExist = await userModel.findOne({ $or: [{ username }, { email }] });
        
        if (isUserAlreadyExist) {
            return res.status(400).json({ success: false, error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({ username, email, password: hashedPassword })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
            id: user._id,
            username: user.username,
            email: user.email
        }});
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @name loginController
 * @description Login a user
 * @route POST /api/auth/login
 * @access Public
 */

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
            id: user._id,
            username: user.username,
            email: user.email
        }});
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @name logoutController
 * @description clear token from cookies and add token to blacklist
 * @route POST /api/auth/logout
 * @access Public
 */

const logoutController = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ success: false, error: "No token found" });
        }
        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isTokenBlacklisted) {
            return res.status(400).json({ success: false, error: "Token already blacklisted" });
        }
        await tokenBlacklistModel.create({ token });
        res.clearCookie("token");
        res.status(200).json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {registerController, loginController, logoutController};