const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require('../models/blacklist.model')

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const isTokenBlacklisted = await tokenBlacklistModel.findOne({token })
        if (isTokenBlacklisted) {
            return res.status(400).json({ success: false, error: "Token already blacklisted" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = authMiddleware;