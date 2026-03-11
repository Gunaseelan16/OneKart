import express from 'express';
import { getPendingStores, approveStore, rejectStore, getAllStores, getStoreDetails } from '../controllers/adminController.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stores', isAdmin, getAllStores);
router.get('/stores/pending', isAdmin, getPendingStores);
router.get('/store/:id', isAdmin, getStoreDetails);
router.patch('/store/approve/:id', isAdmin, approveStore);
router.patch('/store/reject/:id', isAdmin, rejectStore);

export default router;
