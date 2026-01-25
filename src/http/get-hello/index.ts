import { Router } from 'express';
import { Request, Response } from 'express';

const http = Router();

http.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World from Express and TypeScript!' });
});

export default http;

