import express from 'express';
import { addReview, getProductReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', addReview);
router.get('/:productId', getProductReviews);

export default router;
