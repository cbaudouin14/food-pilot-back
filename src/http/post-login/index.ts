import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import executeQuery from '../../shared/db';
import { signToken } from '../../utils/jwt';

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

    if (!user) return res.status(401).json({ message: 'Incorrect email or password' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Incorrect email or password' });

    // 🔹 Utilisation de la fonction signToken
    const token = signToken({ userID: user.userID, email: user.email, role: user.role });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 3600 * 1000
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error login:', error);
    res.status(500).json({ message: 'Error server' });
  }
});

export default http;