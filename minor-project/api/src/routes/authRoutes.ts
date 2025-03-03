import { Router } from 'express';
import { login, singup } from '../controllers/authControllers';

const router = Router();

router.route('/signup').post(singup);

router.route('/login').post(login);


export default router;
