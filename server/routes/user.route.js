import express from 'express';
import { updateUser } from '../controllers/user.controller.js';
import { verifyUser } from '../middleware/verifyUser.js';

const router = express.Router();

router.put('/update/:userId', verifyUser, updateUser);

export default router;