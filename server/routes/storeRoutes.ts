import express from 'express';
import { createStore, getStoreStatus, getApprovedStores, getStoreByBrandName } from '../controllers/storeController.js';

const router = express.Router();

router.post('/create', createStore);
router.get('/status/:clerkId', getStoreStatus);
router.get('/approved', getApprovedStores);
router.get('/brand/:brandName', getStoreByBrandName);

export default router;
