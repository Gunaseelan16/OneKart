import { Request, Response } from 'express';
import pool from '../config/db.js';

const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, orderId]);
    console.log(`Order ${orderId} status updated to ${status}`);
    
    if (status === 'Delivered') {
      // In a real app, send email here
      console.log(`Email notification sent for order ${orderId}`);
    }
  } catch (error) {
    console.error(`Error updating order ${orderId} status:`, error);
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const { userId, addressId, totalPrice, paymentMethod, cartItems } = req.body;
  try {
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, address_id, total_price, payment_method, status) 
       VALUES ($1, $2, $3, $4, 'Processing') 
       RETURNING *`,
      [userId, addressId, totalPrice, paymentMethod]
    );
    
    const orderId = orderResult.rows[0].id;
    
    for (const item of cartItems) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) 
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.id, item.quantity, item.price]
      );
      
      // Update stock
      await pool.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [item.quantity, item.id]
      );
    }

    // Automatic status updates
    setTimeout(() => updateOrderStatus(orderId, 'Shipped'), 10 * 60 * 1000);
    setTimeout(() => updateOrderStatus(orderId, 'Out for Delivery'), 20 * 60 * 1000);
    setTimeout(() => updateOrderStatus(orderId, 'Delivered'), 30 * 60 * 1000);

    res.status(201).json(orderResult.rows[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT o.*, 
       (SELECT json_agg(json_build_object('id', p.id, 'name', p.name, 'image', p.image, 'quantity', oi.quantity, 'price', oi.price))
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = o.id) as items
       FROM orders o 
       WHERE o.user_id = $1 
       ORDER BY o.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { reason } = req.body;
  try {
    const order = await pool.query('SELECT status FROM orders WHERE id = $1', [orderId]);
    if (order.rows[0].status === 'Delivered') {
      return res.status(400).json({ error: 'Cannot cancel a delivered order' });
    }
    
    await pool.query(
      'UPDATE orders SET status = $1, cancellation_reason = $2 WHERE id = $3',
      ['Cancelled', reason, orderId]
    );
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const { userId, orderId } = req.params;
  try {
    const result = await pool.query(
      `SELECT o.*, a.street, a.city, a.state, a.zip_code, a.country,
       (SELECT json_agg(json_build_object('id', p.id, 'name', p.name, 'image', p.image, 'quantity', oi.quantity, 'price', oi.price))
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = o.id) as items
       FROM orders o 
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.user_id = $1 AND o.id = $2`,
      [userId, orderId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Database error' });
  }
};
