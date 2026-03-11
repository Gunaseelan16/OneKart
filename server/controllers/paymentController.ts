import { Request, Response } from 'express';
import Stripe from 'stripe';
import pool from '../config/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { cartItems, userId, addressId, totalPrice } = req.body;

  try {
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.APP_URL}/profile?success=true`,
      cancel_url: `${process.env.APP_URL}/cart`,
      metadata: {
        userId,
        addressId: addressId.toString(),
        totalPrice: totalPrice.toString(),
        cartItems: JSON.stringify(cartItems.map((item: any) => ({ id: item.id, quantity: item.quantity, price: item.price }))),
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Stripe error' });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const { userId, addressId, cartItems, totalPrice, paymentMethod } = req.body;

  try {
    // Start transaction
    await pool.query('BEGIN');

    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, address_id, total_price, payment_method, payment_status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [userId, addressId, totalPrice, paymentMethod, paymentMethod === 'COD' ? 'pending' : 'paid']
    );

    const orderId = orderResult.rows[0].id;

    for (const item of cartItems) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.quantity, item.price]
      );
    }

    await pool.query('COMMIT');
    res.status(201).json({ message: 'Order created successfully', orderId });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const event = req.body;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, addressId, totalPrice, cartItems } = session.metadata;
    const items = JSON.parse(cartItems);

    try {
      await pool.query('BEGIN');

      const orderResult = await pool.query(
        'INSERT INTO orders (user_id, address_id, total_price, payment_method, payment_status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [userId, addressId, totalPrice, 'Stripe', 'paid']
      );

      const orderId = orderResult.rows[0].id;

      for (const item of items) {
        await pool.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
          [orderId, item.id, item.quantity, item.price]
        );
      }

      await pool.query('COMMIT');
      res.json({ received: true });
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error(error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  } else {
    res.json({ received: true });
  }
};
