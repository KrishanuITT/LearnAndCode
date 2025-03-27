import { Router } from 'express';
import { getAllCategories, getCategory } from '../controllers/categoriesController';

const router = Router();

router.route('/').get(getAllCategories);
router.route('/:categoryName').get(getCategory);

export default router;
