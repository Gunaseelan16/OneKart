import { Request, Response } from 'express';
import pool from '../config/db.js';

export const addProduct = async (req: Request, res: Response) => {
  const { storeId, name, description, price, offer_price, category, stock, image } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO products (store_id, name, description, price, offer_price, category, stock, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [storeId, name, description, price, offer_price, category, stock, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    // Only show products from approved stores, include store logo
    const result = await pool.query(`
      SELECT p.*, s.logo as store_logo FROM products p
      JOIN stores s ON p.store_id = s.id
      WHERE s.status = 'approved'
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

export const getProductsByStoreId = async (req: Request, res: Response) => {
  const { storeId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE store_id = $1', [storeId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT p.*, s.name as store_name, s.logo as store_logo, s.tie_up_date
      FROM products p
      JOIN stores s ON p.store_id = s.id
      WHERE p.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, offerPrice, category, stock, imageUrls } = req.body;

  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, offer_price = $4, category = $5, stock = $6, image_urls = $7 WHERE id = $8 RETURNING *',
      [name, description, price, offerPrice, category, stock, imageUrls, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};
