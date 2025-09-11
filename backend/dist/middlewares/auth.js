"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jwt_1 = require("../utils/jwt");
function requireAuth(req, res, next) {
    try {
        const auth = req.headers.authorization;
        if (!auth)
            return res.status(401).json({ message: 'Missing Authorization header' });
        const token = auth.split(' ')[1];
        if (!token)
            return res.status(401).json({ message: 'Missing token' });
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}
