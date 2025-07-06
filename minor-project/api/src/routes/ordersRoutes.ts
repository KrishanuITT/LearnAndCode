import express from 'express';
import { OrderController } from '../controllers/ordersControllers';

const orderRouter = express.Router();
const orderController = new OrderController();

orderRouter.post('/', orderController.createOrder.bind(orderController));
orderRouter.get('/:order_id', orderController.getOrderById.bind(orderController));
orderRouter.get('/user/:user_id', orderController.getOrdersByUserId.bind(orderController));
orderRouter.put('/cancel/:order_id', orderController.cancelOrder.bind(orderController));
orderRouter.get('/:order_id/items', orderController.getOrderItemsByOrderId.bind(orderController));

export default orderRouter;
