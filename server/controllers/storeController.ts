import { Request, Response } from 'express';
import pool from '../config/db.js';

export const createStore = async (req: Request, res: Response) => {
  const { clerkId, name, description, email, logo, fullName } = req.body;

  try {
    // Ensure user exists in our DB
    await pool.query(
      'INSERT INTO users (clerk_id, email, full_name, role) VALUES ($1, $2, $3, $4) ON CONFLICT (clerk_id) DO UPDATE SET full_name = EXCLUDED.full_name',
      [clerkId, email, fullName, 'store']
    );

    const result = await pool.query(
      'INSERT INTO stores (name, logo, description, owner_id, email, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, logo, description, clerkId, email, 'pending']
    );

    res.status(201).json({ message: 'Store request submitted successfully', store: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create store' });
  }
};

export const getStoreByBrandName = async (req: Request, res: Response) => {
  const { brandName } = req.params;
  try {
    const result = await pool.query('SELECT * FROM stores WHERE name = $1', [brandName]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

export const getApprovedStores = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM stores WHERE status = $1', ['approved']);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

export const getStoreStatus = async (req: Request, res: Response) => {
  const { clerkId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM stores WHERE owner_id = $1', [clerkId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};
