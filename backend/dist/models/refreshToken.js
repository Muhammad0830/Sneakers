"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRefreshToken = saveRefreshToken;
exports.deleteRefreshToken = deleteRefreshToken;
exports.findRefreshToken = findRefreshToken;
exports.deleteTokensForUser = deleteTokensForUser;
const helper_1 = require("../middlewares/helper");
async function saveRefreshToken(userId, token, expiresAt) {
    await (0, helper_1.query)("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (:userId, :token, :expiresAt)", { userId: userId, token: token, expiresAt: expiresAt });
}
async function deleteRefreshToken(token) {
    await (0, helper_1.query)("DELETE FROM refresh_tokens WHERE token = ?", [token]);
}
async function findRefreshToken(token) {
    const rows = await (0, helper_1.query)("SELECT * FROM refresh_tokens WHERE token = ?", [
        token,
    ]);
    const arr = rows;
    return arr[0] ?? null;
}
async function deleteTokensForUser(userId) {
    await (0, helper_1.query)("DELETE FROM refresh_tokens WHERE user_id = ?", [userId]);
}
