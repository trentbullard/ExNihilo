import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/session', authController.getSession);
router.post('/google', authController.googleAuth);
router.post('/logout', authController.logout);

export default router;
