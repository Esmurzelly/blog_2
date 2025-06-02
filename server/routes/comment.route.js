import express from 'express';
import { createComment, editComment, getPostComments, likeComment } from '../controllers/comment.controller.js';
import { verifyUser } from '../middleware/verifyUser.js';

const router = express.Router();

router.post('/create', verifyUser, createComment);
router.get('/getPostComments/:postId', getPostComments);
router.put('/likeComment/:commentId', verifyUser, likeComment);
router.put('/editComment/:commentId', verifyUser, editComment);

export default router;
