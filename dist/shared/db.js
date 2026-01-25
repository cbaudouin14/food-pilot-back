"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/utils/db.ts
const promise_1 = __importDefault(require("mysql2/promise")); // Utilisation de mysql2 avec Promises pour plus de simplicité
// Configuration de la connexion à la base de données
const pool = promise_1.default.createPool({
    host: 'localhost', // ou l'adresse de ton serveur MySQL
    user: 'root', // ou l'utilisateur que tu utilises pour te connecter à MySQL
    password: 'password', // mot de passe
    database: 'foodpilot_db', // nom de la base de données
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
// Fonction générique pour exécuter des requêtes SQL
const executeQuery = (query_1, ...args_1) => __awaiter(void 0, [query_1, ...args_1], void 0, function* (query, values = []) {
    try {
        const [rows] = yield pool.execute(query, values); // Exécution de la requête SQL
        return rows; // Retourne les résultats de la requête
    }
    catch (error) {
        console.error('Erreur SQL:', error);
        throw new Error('Erreur lors de l\'exécution de la requête');
    }
});
exports.default = executeQuery;
