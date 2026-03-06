import { Router, Response } from 'express';
import executeQuery from '../../shared/db';
import { authenticateToken, requireSuperAdmin, AuthRequest } from '../../utils/middleware';

const router = Router();

router.post('/', authenticateToken, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { name, address, city, postal_code } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Restaurant name is required' });
    }

    const query = `
      INSERT INTO restaurants (name, address, city, postal_code)
      VALUES (?, ?, ?, ?)
    `;
    const result = await executeQuery(query, [name, address || null, city || null, postal_code || null]);

    res.status(201).json({ message: 'Restaurant created', id: (result as any).insertId });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ message: 'Error creating restaurant' });
  }
});

export default router;