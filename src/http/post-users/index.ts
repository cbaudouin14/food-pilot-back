import { Router, Request, Response } from 'express';
import { auth } from '../../utils/auth';
import bcrypt from 'bcrypt';
import executeQuery from '../../shared/db';
import { v7 as uuidv7 } from 'uuid';

const http = Router();

// POST /users
http.post('/', auth,  async (req: Request, res: Response) => {
  try {
    const { lastname, firstname, email, password } = req.body;

    if (!lastname || !firstname || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const userID = uuidv7();
    const query = `
      INSERT INTO users (userID ,lastname, firstname, email, password)
      VALUES (?, ?, ?, ?, ?)
    `;
    await executeQuery(query, [userID, lastname, firstname, email, password_hash]);

    res.status(201).json({ message: 'User created', userID: userID });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Email already in use' });
    }
    console.error('Error register:', error);
    res.status(500).json({ message: 'Error server' });
  }
});

export default http;
