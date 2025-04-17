import { Router } from 'express';
import {CartController} from '../controllers/cartController';

const router = Router();
const cartController = new CartController()
router.post('/', cartController.createCart.bind(cartController));
router.get('/:user_id', cartController.getCart.bind(cartController));
router.delete('/:user_id', cartController.emptyCart.bind(cartController));

router.post('/items', cartController.addToCart.bind(cartController));
router.get('/items/:cart_id', cartController.getCartItems.bind(cartController));
router.put('/items/:item_id', cartController.updateCartItem.bind(cartController));
router.delete('/items/:item_id', cartController.removeCartItem.bind(cartController));

export default router;
