"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.createUser = createUser;
const helper_1 = require("../middlewares/helper");
async function findUserByEmail(email) {
    const rows = await (0, helper_1.query)("SELECT * FROM users WHERE email = ?", [email]);
    const arr = rows;
    return arr[0] ?? null;
}
async function findUserById(id) {
    const rows = await (0, helper_1.query)("SELECT * FROM users WHERE id = ?", [id]);
    const arr = rows;
    return arr[0] ?? null;
}
async function createUser(email, passwordHash, name) {
    const res = await (0, helper_1.query)("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)", [email, passwordHash, name ?? null]);
    return res.insertId;
}
