import express from 'express';
import { createOrder, getOrders, cancelOrder, getOrderById } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/:userId', getOrders);
router.get('/:userId/:orderId', getOrderById);
router.post('/:orderId/cancel', cancelOrder);

export default router;
