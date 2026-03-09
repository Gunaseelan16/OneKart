import express from 'express';
import { createStore, getStoreStatus } from '../controllers/storeController.js';

const router = express.Router();

router.post('/create', createStore);
router.get('/status/:clerkId', getStoreStatus);

export default router;
