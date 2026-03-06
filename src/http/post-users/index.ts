import { Router, Response } from 'express';
import bcrypt from 'bcrypt';
import executeQuery from '../../shared/db';
import { v7 as uuidv7 } from 'uuid';
import { authenticateToken, requireAdmin, AuthRequest } from '../../utils/middleware';
import crypto from 'crypto';

const http = Router();

function generateRandomPassword(length = 12): string {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

// POST /users - création par un admin
http.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { lastname, firstname, email, role, restaurant_id } = req.body;

    if (!lastname || !firstname || !email || !role) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    if (role === 'admin' && req.user?.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can create admin users' });
    }

    const password = generateRandomPassword();
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const userID = uuidv7();
    const query = `
      INSERT INTO users (userID, lastname, firstname, email, password, role, restaurant_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await executeQuery(query, [userID, lastname, firstname, email, password_hash, role, restaurant_id || null]);

    res.status(201).json({ message: 'User created', userID, password });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already in use' });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error server' });
  }
});

export default http;