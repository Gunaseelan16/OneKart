import express from 'express';
import { syncUser, getUserProfile, addAddress } from '../controllers/userController.js';

const router = express.Router();

router.post('/sync', syncUser);
router.get('/profile/:clerkId', getUserProfile);
router.post('/address', addAddress);

export default router;
