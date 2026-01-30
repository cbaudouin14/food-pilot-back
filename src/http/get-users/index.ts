import { Router, Request, Response } from 'express';
import { auth } from '../../utils/auth';
import executeQuery from '../../shared/db';

const http = Router();

// Route GET /users
http.get('/', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const query = 'SELECT userID, lastname, firstname, email FROM users';
    const users = await executeQuery(query);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

// Route GET /users/{id}
http.get('/:userID', auth, async (req, res) => {
  try {
    const { userID } = req.params;  
    const query = 'SELECT userID, lastname, firstname, email FROM users WHERE userID = ?';
    const users = await executeQuery(query, [userID]);
    res.status(200).json(users);
  } catch(error) {
    console.error('Erreur get-users:', error);
    res.status(500).json({ message: "Error retrieving user" });
  }
  
});

export default http;
