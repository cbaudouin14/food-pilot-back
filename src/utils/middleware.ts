// src/utils/middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from './jwt';
// -------------------------
// Type personnalisé
// -------------------------
export interface AuthRequest extends Request {
  user?: {
    userID: string;
    email: string;
    role: string;
  };
}

// -------------------------
// Middleware : Vérifie JWT et attache req.user
// -------------------------
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // Récupérer le token depuis le cookie
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    // Vérifier le token avec la fonction centralisée
    const payload: JwtPayload = verifyToken(token);

    // Attacher les informations de l'utilisateur à la requête
    req.user = {
      userID: payload.userID,
      email: payload.email,
      role: payload.role
    };

    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// -------------------------
// Middleware : Vérifie que l'utilisateur est admin
// -------------------------
export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

// -------------------------
// Middleware : Vérifie que l'utilisateur est superadmin
// -------------------------
export function requireSuperAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Superadmin access required' });
  }
  next();
}

// -------------------------
// Middleware : Vérifie que l'utilisateur est manager (exemple)
// -------------------------
export function requireManager(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Manager access required' });
  }
  next();
}

// -------------------------
// Middleware : Vérifie que l'utilisateur est connecté
// -------------------------
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
}