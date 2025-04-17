import express from 'express';
import { ProductController } from '../controllers/productsController';

const router = express.Router();
const productController = new ProductController();

router.get('/', productController.getAllProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));
router.get('/category/:category_id', productController.getProductsByCategory.bind(productController));

export default router;
