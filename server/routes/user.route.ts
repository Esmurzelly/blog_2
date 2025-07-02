import express from 'express';
import { deleteUser, getUser, getUsers, signout, updateUser, uploadAvatar } from '../controllers/user.controller.js';
import { verifyUser } from '../middleware/verifyUser.js';

const router = express.Router();

router.put('/update/:userId', verifyUser, updateUser);
router.post('/avatar', verifyUser, uploadAvatar);
router.delete('/delete/:userId', verifyUser, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyUser, getUsers);
router.get('/getuser/:userId', getUser)

export default router;