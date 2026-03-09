import { Request, Response } from 'express';
import pool from '../config/db.js';

export const createStore = async (req: Request, res: Response) => {
  const { clerkId, storeName, description, email, contactNumber, address, logoUrl } = req.body;

  try {
    // Ensure user exists in our DB
    await pool.query(
      'INSERT INTO users (clerk_id, email, role) VALUES ($1, $2, $3) ON CONFLICT (clerk_id) DO NOTHING',
      [clerkId, email, 'store']
    );

    const result = await pool.query(
      'INSERT INTO stores (owner_id, store_name, description, email, contact_number, address, logo_url, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [clerkId, storeName, description, email, contactNumber, address, logoUrl, 'pending']
    );

    res.status(201).json({ message: 'Store request submitted successfully', store: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create store' });
  }
};

export const getStoreStatus = async (req: Request, res: Response) => {
  const { clerkId } = req.params;

  try {
    const result = await pool.query('SELECT status FROM stores WHERE owner_id = $1', [clerkId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json({ status: result.rows[0].status });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};
