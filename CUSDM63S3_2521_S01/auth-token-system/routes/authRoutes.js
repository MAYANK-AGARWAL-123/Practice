import express from 'express';
import { login, refreshToken, protectedRoute } from '../controllers/authController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router.post('/login', login);
router.post('/token', refreshToken);
router.get('/protected', authenticate, protectedRoute);

export default router;
