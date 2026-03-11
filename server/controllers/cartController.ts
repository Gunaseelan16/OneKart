import { Request, Response } from 'express';
import pool from '../config/db.js';

export const getCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.*, p.name, p.price, p.offer_price, p.image, p.brand 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const { userId, productId, quantity } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO cart (user_id, product_id, quantity) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (user_id, product_id) 
       DO UPDATE SET quantity = cart.quantity + $3 
       RETURNING *`,
      [userId, productId, quantity || 1]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const updateCartQuantity = async (req: Request, res: Response) => {
  const { userId, productId, quantity } = req.body;
  try {
    const result = await pool.query(
      `UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *`,
      [quantity, userId, productId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  const { userId, productId } = req.params;
  try {
    await pool.query('DELETE FROM cart WHERE user_id = $1 AND product_id = $2', [userId, productId]);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Database error' });
  }
};
