import { Router, Request, Response } from 'express';
import executeQuery from '../../shared/db';

const router = Router();

// Route GET /get-users
router.get('/', async (req: Request, res: Response): Promise<void> => {
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

export default router;
