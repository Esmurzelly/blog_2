import express from 'express';
import { createComment } from '../controllers/comment.controller.js';
import { verifyUser } from '../middleware/verifyUser.js';

const router = express.Router();

router.post('/create', verifyUser, createComment)

export default router;
