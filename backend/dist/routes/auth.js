"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const UserModel = __importStar(require("../models/user"));
const RTModel = __importStar(require("../models/refreshToken"));
const authRouter = express_1.default.Router();
const COOKIE_NAME = "refreshToken";
const REFRESH_EXPIRES_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
// POST /api/auth/signup
authRouter.post("/signup", (0, express_validator_1.body)("email").isEmail(), (0, express_validator_1.body)("password").isLength({ min: 6 }), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const { email, password, name } = req.body;
    try {
        const existing = await UserModel.findUserByEmail(email);
        if (existing)
            return res.status(409).json({ message: "Email already in use" });
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const userId = await UserModel.createUser(email, passwordHash, name);
        const accessToken = (0, jwt_1.createAccessToken)({ userId, email });
        const refreshToken = (0, jwt_1.createRefreshToken)({ userId, email });
        // compute expires_at for DB
        const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        await RTModel.saveRefreshToken(userId, refreshToken, expiresAt);
        // set httpOnly cookie
        res.cookie(COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: REFRESH_EXPIRES_MS,
        });
        return res
            .status(201)
            .json({ accessToken, user: { id: userId, email, name } });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
authRouter.post("/login", (0, express_validator_1.body)("email").isEmail(), (0, express_validator_1.body)("password").isLength({ min: 6 }), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try {
        const user = await UserModel.findUserByEmail(email);
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });
        const ok = await bcrypt_1.default.compare(password, user.password_hash);
        if (!ok)
            return res.status(401).json({ message: "Invalid credentials" });
        const accessToken = (0, jwt_1.createAccessToken)({ userId: user.id, email });
        const refreshToken = (0, jwt_1.createRefreshToken)({ userId: user.id, email });
        const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        // Save refresh token
        await RTModel.saveRefreshToken(user.id, refreshToken, expiresAt);
        res.cookie(COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: REFRESH_EXPIRES_MS,
        });
        return res.json({
            accessToken,
            user: { id: user.id, email: user.email, name: user.name },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
authRouter.post("/refresh", async (req, res) => {
    try {
        const token = req.cookies[COOKIE_NAME];
        if (!token)
            return res.status(401).json({ message: "No refresh token" });
        // verify token signature
        let payload;
        try {
            payload = (0, jwt_1.verifyRefreshToken)(token);
        }
        catch (e) {
            return res
                .status(401)
                .json({ message: "Invalid or expired refresh token" });
        }
        // ensure token exists in DB
        const dbToken = await RTModel.findRefreshToken(token);
        if (!dbToken)
            return res.status(401).json({ message: "Refresh token revoked" });
        // rotate tokens: delete current and issue new
        await RTModel.deleteRefreshToken(token);
        const newAccessToken = (0, jwt_1.createAccessToken)({
            userId: payload.userId,
            email: payload.email,
        });
        const newRefreshToken = (0, jwt_1.createRefreshToken)({
            userId: payload.userId,
            email: payload.email,
        });
        const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        await RTModel.saveRefreshToken(payload.userId, newRefreshToken, expiresAt);
        res.cookie(COOKIE_NAME, newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: REFRESH_EXPIRES_MS,
        });
        return res.json({ accessToken: newAccessToken });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
authRouter.post("/logout", async (req, res) => {
    try {
        const token = req.cookies[COOKIE_NAME];
        if (token) {
            await RTModel.deleteRefreshToken(token);
        }
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });
        return res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.default = authRouter;
