import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'db',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'rootpassword',
  database: process.env.MYSQL_DB || 'foodpilot',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const executeQuery = async (
  query: string,
  values: any[] = []
): Promise<any> => {
  try {
    const [rows] = await pool.execute(query, values);
    return rows;
  } catch (error) {
    console.error('Erreur SQL:', error);
    throw error;
  }
};

export default executeQuery;
