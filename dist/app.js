"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Middleware pour parser le JSON
app.use(express_1.default.json());
// Charger automatiquement toutes les routes dans src/http
const routesPath = path_1.default.join(__dirname, 'http');
fs_1.default.readdirSync(routesPath).forEach((folder) => {
    const routeDir = path_1.default.join(routesPath, folder);
    const stat = fs_1.default.statSync(routeDir);
    if (stat.isDirectory()) {
        const routeFile = path_1.default.join(routeDir, 'index.ts');
        if (fs_1.default.existsSync(routeFile)) {
            try {
                // Import synchrone pour éviter les problèmes d'asynchronisme
                const routeModule = require(routeFile).default;
                app.use(`/${folder}`, routeModule);
                console.log(`Route /${folder} chargée`);
            }
            catch (err) {
                console.error(`Erreur en important la route /${folder}:`, err);
            }
        }
    }
});
exports.default = app;
