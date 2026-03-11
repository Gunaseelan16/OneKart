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
    const result = await pool.query(`
      SELECT s.*, 
      (SELECT COUNT(*) FROM products p WHERE p.store_id = s.id) as product_count 
      FROM stores s
    `);
    
    const stores = result.rows;
    
    // Clerk is removed, so we'll just return the stores with a placeholder owner name
    const storesWithOwners = stores.map((store) => ({
      ...store,
      owner_name: 'Store Owner'
    }));

    res.json(storesWithOwners);
  } catch (error) {
    console.error(error);
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

export const getStoreDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const storeResult = await pool.query('SELECT * FROM stores WHERE id = $1', [id]);
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const productsResult = await pool.query('SELECT * FROM products WHERE store_id = $1', [id]);
    
    res.json({
      ...storeResult.rows[0],
      products: productsResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};
