import { Router, Response } from 'express';
import executeQuery from '../../shared/db';
import { authenticateToken, requireAdmin, AuthRequest } from '../../utils/middleware';

const router = Router();

router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, city, postal_code } = req.body;

    const fields: string[] = [];
    const values: any[] = [];

    if (name) { fields.push('name = ?'); values.push(name); }
    if (address) { fields.push('address = ?'); values.push(address); }
    if (city) { fields.push('city = ?'); values.push(city); }
    if (postal_code) { fields.push('postal_code = ?'); values.push(postal_code); }

    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });

    const query = `UPDATE restaurants SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    await executeQuery(query, values);
    res.status(200).json({ message: 'Restaurant updated', id });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ message: 'Error updating restaurant' });
  }
});

export default router;