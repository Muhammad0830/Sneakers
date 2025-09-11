"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = query;
const mysql_1 = require("../db/mysql");
const pool = (0, mysql_1.createPool)();
function sqlWithNamedParams(sql, params) {
    const values = [];
    const parsedSql = sql.replace(/:(\w+)/g, (_, key) => {
        if (!(key in params)) {
            throw new Error(`Missing SQL param: ${key}`);
        }
        values.push(params[key]);
        return "?";
    });
    return { sql: parsedSql, values };
}
async function query(sql, params) {
    let finalSql = sql;
    let values;
    if (params) {
        if (Array.isArray(params)) {
            values = params;
        }
        else {
            const result = sqlWithNamedParams(sql, params);
            finalSql = result.sql;
            values = result.values;
        }
    }
    const [rows] = values
        ? await pool.query(finalSql, values)
        : await pool.query(finalSql);
    return rows;
}
