import express from 'express';
import { createComment, deleteComment, editComment, getcomments, getPostComments, likeComment } from '../controllers/comment.controller.js';
import { verifyUser } from '../middleware/verifyUser.js';

const router = express.Router();

router.post('/create', verifyUser, createComment);
router.get('/getPostComments/:postId', getPostComments);
router.get('/getcomments', verifyUser, getcomments);
router.put('/likeComment/:commentId', verifyUser, likeComment);
router.put('/editComment/:commentId', verifyUser, editComment);
router.delete('/deleteComment/:commentId', verifyUser, deleteComment);

export default router;
