import { Request, Response } from 'express';
import pool from '../config/db.js';

export const getCoupons = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM coupons WHERE is_active = true AND expiry_date >= CURRENT_DATE');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

export const validateCoupon = async (req: Request, res: Response) => {
  const { code } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM coupons WHERE code = $1 AND is_active = true AND expiry_date >= CURRENT_DATE',
      [code]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid or expired coupon' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

export const createCoupon = async (req: Request, res: Response) => {
  const { code, discount, expiryDate } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO coupons (code, discount, expiry_date) VALUES ($1, $2, $3) RETURNING *',
      [code, discount, expiryDate]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM coupons WHERE id = $1', [id]);
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};
