import { Router, Response } from 'express';
import executeQuery from '../../shared/db';
import { authenticateToken, requireSuperAdmin, AuthRequest } from '../../utils/middleware';

const router = Router();

router.delete('/:id', authenticateToken, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const checkQuery = 'SELECT id FROM restaurants WHERE id = ?';
    const rows = await executeQuery(checkQuery, [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const deleteQuery = 'DELETE FROM restaurants WHERE id = ?';
    await executeQuery(deleteQuery, [id]);

    res.status(200).json({ message: 'Restaurant deleted', id });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ message: 'Error deleting restaurant' });
  }
});

export default router;