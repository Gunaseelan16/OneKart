import express from 'express';
import { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart } from '../controllers/cartController.js';

const router = express.Router();

router.get('/:userId', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartQuantity);
router.delete('/:userId/:productId', removeFromCart);
router.delete('/:userId', clearCart);

export default router;
