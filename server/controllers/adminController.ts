import { Request, Response } from 'express';
import pool from '../config/db.js';

export const getPendingStores = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM stores WHERE status = $1', ['pending']);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

export const getAllStores = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM stores');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

export const approveStore = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE stores SET status = $1 WHERE id = $2', ['approved', id]);
    res.json({ message: 'Store approved' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

export const rejectStore = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE stores SET status = $1 WHERE id = $2', ['rejected', id]);
    res.json({ message: 'Store rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};
