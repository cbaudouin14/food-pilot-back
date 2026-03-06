import { Router, Response } from 'express';
import bcrypt from 'bcrypt';
import executeQuery from '../../shared/db';
import { authenticateToken, requireAdmin, AuthRequest } from '../../utils/middleware';

const router = Router();

// PUT /users/:userID - accessible uniquement aux admins
router.put('/:userID', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { userID } = req.params;
    const { lastname, firstname, email, password, role, restaurant_id } = req.body;

    // Vérifier si l'utilisateur existe
    const checkQuery = 'SELECT userID FROM users WHERE userID = ?';
    const users = await executeQuery(checkQuery, [userID]);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Construire la liste des champs à mettre à jour
    const fields: string[] = [];
    const values: any[] = [];

    if (lastname) { fields.push('lastname = ?'); values.push(lastname); }
    if (firstname) { fields.push('firstname = ?'); values.push(firstname); }
    if (email) { fields.push('email = ?'); values.push(email); }
    if (role) { fields.push('role = ?'); values.push(role); }
    if (restaurant_id !== undefined) { fields.push('restaurant_id = ?'); values.push(restaurant_id); }
    if (password) {
      const password_hash = await bcrypt.hash(password, 10);
      fields.push('password = ?');
      values.push(password_hash);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const updateQuery = `UPDATE users SET ${fields.join(', ')} WHERE userID = ?`;
    values.push(userID);

    await executeQuery(updateQuery, values);

    res.status(200).json({ message: 'User updated successfully', userID });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already in use' });
    }
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

export default router;