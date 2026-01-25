// src/utils/db.ts
import mysql from 'mysql2/promise'; // Utilisation de mysql2 avec Promises pour plus de simplicité

// Configuration de la connexion à la base de données
const pool = mysql.createPool({
  host: 'localhost', // ou l'adresse de ton serveur MySQL
  user: 'root', // ou l'utilisateur que tu utilises pour te connecter à MySQL
  password: 'password', // mot de passe
  database: 'foodpilot_db', // nom de la base de données
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Fonction générique pour exécuter des requêtes SQL
const executeQuery = async (query: string, values: any[] = []): Promise<any> => {
  try {
    const [rows] = await pool.execute(query, values); // Exécution de la requête SQL
    return rows; // Retourne les résultats de la requête
  } catch (error) {
    console.error('Erreur SQL:', error);
    throw new Error('Erreur lors de l\'exécution de la requête');
  }
};

export default executeQuery;

