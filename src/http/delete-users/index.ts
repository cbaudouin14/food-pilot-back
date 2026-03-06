import { Router, Response } from 'express';
import executeQuery from '../../shared/db';
import { authenticateToken, requireAdmin, AuthRequest } from '../../utils/middleware';

const router = Router();

// DELETE /users/:userID - accessible uniquement aux admins
router.delete('/:userID', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { userID } = req.params;

    // Vérifier si l'utilisateur existe
    const checkQuery = 'SELECT userID FROM users WHERE userID = ?';
    const users = await executeQuery(checkQuery, [userID]);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user?.userID === userID) {
        return res.status(403).json({ message: "You cannot delete your own account" });
    }

    // Supprimer l'utilisateur
    const deleteQuery = 'DELETE FROM users WHERE userID = ?';
    await executeQuery(deleteQuery, [userID]);

    res.status(200).json({ message: 'User deleted successfully', userID });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

export default router;