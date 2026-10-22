import jwt from 'jsonwebtoken';
export function verifyToken(token: string) {
  const payload = jwt.verify(token, process.env.JWT_SECRET as string);
  if (typeof payload === 'string' || typeof payload.id !== 'string' || typeof payload.exp !== 'number') throw new Error('Invalid token');
  return { id: payload.id, exp: payload.exp };
}
