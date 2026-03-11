import { Request, Response, NextFunction } from 'express';
import pool from '../config/db.js';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  // Bypassing auth for now as Clerk is removed
  next();
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // Bypassing admin check for now or using a simple header check
  const email = req.headers['x-clerk-email'] as string;

  if (email === process.env.VITE_ADMIN_EMAIL || !process.env.VITE_ADMIN_EMAIL) {
    return next();
  }

  res.status(403).json({ error: 'Admin access required' });
};

export const isApprovedStore = async (req: Request, res: Response, next: NextFunction) => {
  const clerkId = req.headers['x-clerk-id'] as string || 'mock_user_123';

  try {
    const result = await pool.query('SELECT status FROM stores WHERE owner_id = $1', [clerkId]);
    if (result.rows.length > 0 && result.rows[0].status === 'approved') {
      return next();
    }
    // For mock user, let's assume it's approved if we are in dev/mock mode
    if (clerkId === 'mock_user_123') return next();
    
    res.status(403).json({ error: 'Store not approved or not found' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};
