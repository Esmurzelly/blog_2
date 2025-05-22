import express from 'express';
import { updateUser, uploadAvatar } from '../controllers/user.controller.js';
import { verifyUser } from '../middleware/verifyUser.js';

const router = express.Router();

router.put('/update/:userId', verifyUser, updateUser);

router.post('/avatar', verifyUser, uploadAvatar);

export default router;