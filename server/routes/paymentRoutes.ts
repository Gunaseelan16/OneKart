import express from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/checkout', createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
