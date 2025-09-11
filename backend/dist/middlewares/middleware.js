"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};
exports.default = unknownEndpoint;
