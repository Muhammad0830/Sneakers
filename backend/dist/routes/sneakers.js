"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = require("../db/mysql");
const helper_1 = require("../middlewares/helper");
const pool = (0, mysql_1.createPool)();
const sneakersRouter = express_1.default.Router();
sneakersRouter.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        const fetchType = req.query.fetchType;
        const genders = req.query.gender; // can be string or array
        const colors = req.query.color;
        const sizes = req.query.size;
        const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
        const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;
        const allowedSortFields = ["popular", "sale", "top", "new"];
        let sortBy = "id";
        if (allowedSortFields.includes(req.query.sortBy)) {
            if (req.query.sortBy === "new")
                sortBy = "created_at";
            else if (req.query.sortBy === "top")
                sortBy = "rating";
            else if (req.query.sortBy === "popular")
                sortBy = "JSON_LENGTH(reviews)";
            else if (req.query.sortBy === "sale")
                sortBy = "discount_value";
            else
                sortBy = req.query.sortBy;
        }
        const order = req.query.order === "desc" ? "DESC" : "ASC";
        const whereClauses = [];
        const params = { limit, offset };
        if (genders) {
            if (Array.isArray(genders)) {
                whereClauses.push(`gender IN (:genders)`);
                params.genders = genders;
            }
            else {
                whereClauses.push(`gender = :gender`);
                params.gender = genders;
            }
        }
        if (colors) {
            if (Array.isArray(colors)) {
                const colorConditions = colors.map((c, i) => `FIND_IN_SET(:color${i}, REPLACE(color, ' ', ''))`);
                whereClauses.push(`(${colorConditions.join(" OR ")})`);
                // Add parameters
                colors.forEach((c, i) => {
                    params[`color${i}`] = c;
                });
            }
            else {
                whereClauses.push(`FIND_IN_SET(:color, REPLACE(color, ' ', ''))`);
                params.color = colors;
            }
        }
        if (sizes) {
            if (Array.isArray(sizes)) {
                const sizeConditions = sizes.map((s, i) => `FIND_IN_SET(:size${i}, REPLACE(size, ' ', ''))`);
                whereClauses.push(`(${sizeConditions.join(" OR ")})`);
                sizes.forEach((s, i) => {
                    params[`size${i}`] = s;
                });
            }
            else {
                whereClauses.push(`FIND_IN_SET(:size, REPLACE(size, ' ', ''))`);
                params.size = sizes;
            }
        }
        if (minPrice !== null) {
            whereClauses.push(`price >= :minPrice`);
            params.minPrice = minPrice;
        }
        if (maxPrice !== null) {
            whereClauses.push(`price <= :maxPrice`);
            params.maxPrice = maxPrice;
        }
        const whereSQL = whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : "";
        const data = await (0, helper_1.query)(`SELECT p.*, COALESCE(s.discount_type, NULL) AS discount_type, COALESCE(s.discount_value, NULL) AS discount_value 
        FROM products as p LEFT JOIN on_sale as s ON p.id = s.product_id 
        AND NOW() BETWEEN s.sale_from AND s.sale_to AND s.status = 'active'
        ${whereSQL} ORDER BY ${sortBy} ${order} LIMIT :limit OFFSET :offset`, params);
        if (data.length === 0) {
            return res
                .status(200)
                .json({ page, limit, total: 0, totalPages: 1, data: [] });
        }
        const totalResult = await (0, helper_1.query)(`SELECT COUNT(*) as count FROM products ${whereSQL}`, params);
        const total = totalResult[0].count;
        const totalPages = Math.ceil(total / limit);
        const finalColors = data[0].color.split(", ");
        const finalSizes = data[0].size.split(", ");
        res.status(200).json({
            page,
            limit,
            total,
            totalPages,
            data: data.map((item) => ({
                ...item,
                color: finalColors,
                size: finalSizes,
            })),
            hasMore: fetchType === "scroll" ? offset + limit < total : false,
        });
    }
    catch (err) {
        if (res.status) {
            res.status(500).json({ message: err.message });
        }
        else {
            throw new Error(err.message);
        }
    }
});
sneakersRouter.get("/product/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = await (0, helper_1.query)(`SELECT p.*, COALESCE(s.discount_type, NULL) AS discount_type, COALESCE(s.discount_value, NULL) AS discount_value, COALESCE(s.sale_to, null) as sale_to, COALESCE(s.sale_from, null) as sale_from 
        FROM products as p
        LEFT JOIN on_sale as s ON p.id = s.product_id
        WHERE p.id = :id`, {
            id,
        });
        if (data.length <= 0) {
            return res.status(404).json({ message: "no data found" });
        }
        const finalColors = data[0].color.split(", ");
        const finalSizes = data[0].size.split(", ");
        res.status(200).json({
            ...data[0],
            color: finalColors,
            size: finalSizes,
        });
    }
    catch (err) {
        if (res.status) {
            res.status(500).json({ message: err.message });
        }
        else {
            throw new Error(err.message);
        }
    }
});
sneakersRouter.get("/trending", async (req, res) => {
    try {
        const data = await (0, helper_1.query)("SELECT * FROM trending");
        if (data.length <= 0) {
            res.status(404).json({ message: "no data found" });
        }
        res.status(200).json(data);
    }
    catch (err) {
        if (res.status) {
            res.status(500).json({ message: err.message });
        }
        else {
            throw new Error(err.message);
        }
    }
});
sneakersRouter.get("/testimonials", async (req, res) => {
    try {
        const data = await (0, helper_1.query)("SELECT * FROM testimonials");
        if (data.length <= 0) {
            return res.status(404).json({ message: "no data found" });
        }
        return res.status(200).json(data);
    }
    catch (err) {
        if (res.status) {
            return res.status(500).json({ message: err.message });
        }
        else {
            throw new Error(err.message);
        }
    }
});
exports.default = sneakersRouter;
