import { Router, Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';

export function requireRole(role: 'admin' | 'adopter') {
    return (req: Request, res: Response, next: any) => {
      if (!req.isAuthenticated()) {
        return res.status(401).send('Not authenticated');
      }
  
      if (req.user) {
        const user = req.user as IUser;
        if (user.role === role) {
          return next();
        }
      }
  
      return res.status(403).send('Forbidden: Insufficient permissions');
    };
}

export function requireAuthentication() {
  return (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send('Not authenticated');
  }
} 