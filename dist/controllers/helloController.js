"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHelloWorld = void 0;
const getHelloWorld = (req, res) => {
    res.json({ message: 'Hello World from Express and TypeScript!' });
};
exports.getHelloWorld = getHelloWorld;
