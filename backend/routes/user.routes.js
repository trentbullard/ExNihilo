import express from 'express';
import userController from '../controllers/user.controller.js';

const router = express.Router();

router.get('', userController.getUsers);
router.get('/:id', userController.getUser);

export default router;
