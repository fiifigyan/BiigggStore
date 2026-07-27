import { Request, Response, NextFunction } from 'express';

export const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  const providedSecret = req.header('x-admin-secret');
  const bearerToken = req.header('authorization')?.replace(/^Bearer\s+/i, '');
  const expectedSecret = process.env.ADMIN_API_KEY || 'dev-admin-secret';

  if (providedSecret === expectedSecret || bearerToken === expectedSecret) {
    next();
    return;
  }

  res.status(403).json({ success: false, message: 'Admin access required' });
};
