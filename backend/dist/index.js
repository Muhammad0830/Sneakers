"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const PORT = Number(config_1.config.port);
app_1.default.listen(PORT, "0.0.0.0", () => {
    console.log(`server is running on port ${PORT}`);
});
