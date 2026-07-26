import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
const JWT_RESET_EXPIRES_IN = process.env.JWT_RESET_EXPIRES_IN || '1h';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId, purpose: 'refresh' }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN } as any);
};

export const generateResetToken = (userId: string): string => {
  return jwt.sign({ userId, purpose: 'password-reset' }, JWT_SECRET, { expiresIn: JWT_RESET_EXPIRES_IN } as any);
};

export const verifyToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};

export const verifyResetToken = (token: string): { userId: string } => {
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; purpose?: string };
  if (decoded.purpose !== 'password-reset') {
    throw new Error('Invalid reset token purpose');
  }

  return { userId: decoded.userId };
};