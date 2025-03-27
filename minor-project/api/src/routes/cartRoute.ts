import { Router } from 'express';
import { addToCart, createCart, emptyCart, getCart, getCartItems, removeCartItem, updateCartItem } from '../controllers/cartController';

const router = Router();

router.post('/', createCart);
router.get('/:user_id', getCart);
router.delete('/:user_id', emptyCart);

router.post('/items', addToCart);
router.get('/items/:cart_id', getCartItems);
router.put('/items/:item_id', updateCartItem);
router.delete('/items/:item_id', removeCartItem);

export default router;
