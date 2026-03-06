import { Router, Request, Response } from 'express';
import executeQuery from '../../shared/db';
import { authenticateToken, requireAdmin, AuthRequest } from '../../utils/middleware';

const http = Router();

// Route GET /users
http.get('/', authenticateToken, requireAdmin,  async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = 'SELECT userID, lastname, firstname, email, role, restaurant_id FROM users';
    const users = await executeQuery(query);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

// Route GET /users/{id}
http.get('/:userID', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { userID } = req.params;  
    const query = 'SELECT userID, lastname, firstname, email FROM users WHERE userID = ?';
    const users = await executeQuery(query, [userID]);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(users);
  } catch(error) {
    console.error('Erreur get-users:', error);
    res.status(500).json({ message: "Error retrieving user" });
  }
  
});

export default http;
