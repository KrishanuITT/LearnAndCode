import { Router } from 'express';
import { getAllProducts,getProductById,getProductsByCategory} from '../controllers/productsController';

const router = Router();

router.route('/').get(getAllProducts);
router.route('/:id').get(getProductById);
router.route('/category/:category_id').get(getProductsByCategory)

export default router;
