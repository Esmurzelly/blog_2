import express from 'express';
import { verifyUser } from '../middleware/verifyUser.js';
import { create, deletePost, getPosts } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyUser, create);
router.get('/getposts', getPosts);
router.delete('/deletepost/:postId/:userId', verifyUser, deletePost);

export default router;