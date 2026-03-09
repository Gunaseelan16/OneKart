import express from 'express';
import { addProduct, getProducts, updateProduct, deleteProduct, getProductById } from '../controllers/productController.js';
import { isApprovedStore } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', isApprovedStore, addProduct);
router.patch('/:id', isApprovedStore, updateProduct);
router.delete('/:id', isApprovedStore, deleteProduct);

export default router;
