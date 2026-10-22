import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
export default function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.headers.authorization?.startsWith('Bearer ')) throw new Error();
    req.user = verifyToken(req.headers.authorization.slice(7));
    next();
  } catch { res.status(401).json({ message: 'Please sign in again.' }); }
}
