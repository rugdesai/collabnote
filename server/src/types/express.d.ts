import type { verifyToken } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      // Authenticated routes receive the validated claims, not the raw JWT payload.
      user: ReturnType<typeof verifyToken>;
    }
  }
}
