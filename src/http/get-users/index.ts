import { Router, Request, Response } from 'express';
import executeQuery from '../../shared/db';

const http = Router();

// Route GET /get-users
http.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const query = 'SELECT * FROM users'; // Requête SQL
    // const users = await executeQuery(query);
    const users = ["Alice", "Bob"];
    res.status(200).json(users); // Renvoie les résultats
  } catch (error) {
    console.error('Erreur get-users:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

http.get('/:id', async (req, res) => {
  const { id } = req.params;
  // renvoyer l'utilisateur par id
  res.json({ id, name: 'Alice' });
});

export default http;
