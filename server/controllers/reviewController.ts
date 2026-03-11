import { Request, Response } from 'express';
import pool from '../config/db.js';

export const addReview = async (req: Request, res: Response) => {
  const { userId, productId, rating, comment } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO reviews (user_id, product_id, rating, comment) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [userId, productId, rating, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  const { productId } = req.params;
  try {
    const result = await pool.query(
      `SELECT r.*, u.full_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.clerk_id 
       WHERE r.product_id = $1 
       ORDER BY r.created_at DESC`,
      [productId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Database error' });
  }
};
