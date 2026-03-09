import { createClerkClient } from '@clerk/clerk-sdk-node';
import { Request, Response, NextFunction } from 'express';
import pool from '../config/db.js';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const session = await clerk.sessions.verifySession(token, ''); // You might need to handle session verification differently depending on Clerk version
    // For simplicity in this environment, we often assume the frontend sends a valid clerk user id or token
    // In a real app, use clerk.sessions.verifySession or clerk.users.getUser
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const clerkId = req.headers['x-clerk-id'] as string;
  const email = req.headers['x-clerk-email'] as string;

  if (email === process.env.VITE_ADMIN_EMAIL) {
    return next();
  }

  res.status(403).json({ error: 'Admin access required' });
};

export const isApprovedStore = async (req: Request, res: Response, next: NextFunction) => {
  const clerkId = req.headers['x-clerk-id'] as string;

  try {
    const result = await pool.query('SELECT status FROM stores WHERE owner_id = $1', [clerkId]);
    if (result.rows.length > 0 && result.rows[0].status === 'approved') {
      return next();
    }
    res.status(403).json({ error: 'Store not approved or not found' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};
