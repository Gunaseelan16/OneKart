import express from 'express';
import { getCoupons, validateCoupon, createCoupon, deleteCoupon } from '../controllers/couponController.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCoupons);
router.post('/validate', validateCoupon);
router.post('/', isAdmin, createCoupon);
router.delete('/:id', isAdmin, deleteCoupon);

export default router;
