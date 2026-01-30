import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import executeQuery from '../../shared/db';

const http = Router();

// Route POST /login
http.post('/', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    const users: any = await executeQuery(query, [email]);
    const user = users[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!user || !isValid) return res.status(401).json({ message: 'Incorrect email or password' });

    // create JWT
    const token = jwt.sign({ userID: user.userID, email: user.email }, process.env.JWT_SECRET || 'secretkey', {
      expiresIn: '1h',
    });

    res.json({ token, user: { userID: user.userID, lastname: user.lastname, firstname: user.firstname, email: user.email } });
  } catch (error) {
    console.error('Error login:', error);
    res.status(500).json({ message: 'Error server' });
  }
});

export default http;
