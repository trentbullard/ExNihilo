import express from 'express';
import userController from '../controllers/user.controller.js';

const router = express.Router();
router.get('', userController.getUserProfile);
router.get('/profile', userController.getUserProfile);

export default router;
