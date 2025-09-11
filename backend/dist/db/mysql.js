"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPool = createPool;
const promise_1 = __importDefault(require("mysql2/promise"));
const config_1 = require("../config");
function createPool() {
    return promise_1.default.createPool({
        host: config_1.config.host,
        user: config_1.config.user,
        password: config_1.config.password,
        database: config_1.config.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });
}
