import { Request, Response } from 'express';
import pool from '../config/db.js';

export const syncUser = async (req: Request, res: Response) => {
  const { clerkId, email, fullName } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (clerk_id, email, full_name) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (clerk_id) 
       DO UPDATE SET email = $2, full_name = $3 
       RETURNING *`,
      [clerkId, email, fullName]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const { clerkId } = req.params;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE clerk_id = $1', [clerkId]);
    const addressResult = await pool.query('SELECT * FROM addresses WHERE user_id = $1', [clerkId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      ...userResult.rows[0],
      addresses: addressResult.rows
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const addAddress = async (req: Request, res: Response) => {
  const { userId, type, street, city, state, zip_code, country, is_default } = req.body;
  try {
    if (is_default) {
      await pool.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [userId]);
    }
    
    const result = await pool.query(
      `INSERT INTO addresses (user_id, type, street, city, state, zip_code, country, is_default) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [userId, type, street, city, state, zip_code, country, is_default]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ error: 'Database error' });
  }
};
