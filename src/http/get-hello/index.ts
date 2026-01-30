import { Router } from 'express';
import { auth } from '../../utils/auth';
import { Request, Response } from 'express';

const http = Router();

http.get('/', auth,(req: Request, res: Response) => {
  res.json({ message: 'Hello World from Express and TypeScript!' });
});

export default http;

