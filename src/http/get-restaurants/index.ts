import { Router, Response } from 'express';
import executeQuery from '../../shared/db';
import { authenticateToken, AuthRequest } from '../../utils/middleware';

const router = Router();

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const query = 'SELECT * FROM restaurants';
    const restaurants = await executeQuery(query);
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Error fetching restaurants' });
  }
});

export default router;