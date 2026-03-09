import { Request, Response } from 'express';
import Stripe from 'stripe';
import pool from '../config/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { cartItems, userId } = req.body;

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
      success_url: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/cart`,
      metadata: {
        userId,
        cartItems: JSON.stringify(cartItems.map((item: any) => ({ id: item.id, quantity: item.quantity, price: item.price }))),
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Stripe error' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  // In a real app, verify the webhook signature
  const event = req.body;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, cartItems } = session.metadata;
    const items = JSON.parse(cartItems);

    try {
      for (const item of items) {
        await pool.query(
          'INSERT INTO orders (user_id, product_id, quantity, price, payment_status) VALUES ($1, $2, $3, $4, $5)',
          [userId, item.id, item.quantity, item.price, 'paid']
        );
      }
      res.json({ received: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  } else {
    res.json({ received: true });
  }
};
