import { Router } from 'express';
import { createOrder,getOrderById } from '../controllers/ordersControllers';

const router = Router();

router.route('/').post(createOrder);
router.route('/:order_id').get(getOrderById);
export default router;
