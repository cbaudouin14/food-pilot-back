"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http = (0, express_1.Router)();
http.get('/', (req, res) => {
    res.json({ message: 'Hello World from Express and TypeScript!' });
});
exports.default = http;
