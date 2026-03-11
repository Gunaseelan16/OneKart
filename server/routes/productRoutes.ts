import express from 'express';
import { addProduct, getProducts, updateProduct, deleteProduct, getProductById, getProductsByStoreId } from '../controllers/productController.js';
import { isApprovedStore } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/store/:storeId', getProductsByStoreId);
router.get('/:id', getProductById);
router.post('/', isApprovedStore, addProduct);
router.patch('/:id', isApprovedStore, updateProduct);
router.delete('/:id', isApprovedStore, deleteProduct);

export default router;
