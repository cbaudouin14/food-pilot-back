"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const helloController_1 = require("../controllers/helloController");
const router = (0, express_1.Router)();
router.get('/hello', helloController_1.getHelloWorld);
exports.default = router;
