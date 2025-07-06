import express from 'express';
import { AuthController } from '../controllers/authControllers';

const router = express.Router();
const authController = new AuthController();

router.post('/signup', authController.signup.bind(authController));
router.post('/login', authController.login.bind(authController));

export default router;
