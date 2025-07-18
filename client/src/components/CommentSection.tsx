import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState, useAppDispatch } from '../redux/store';
import { createComment, deleteComments, getPostComments, addLikeComment } from '../redux/comments/commentSlice';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { toast } from 'react-toastify';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import defaultAvatar from '../assets/defaultAvatar.jpg'

const CommentSection = ({ postId }: { postId: string | number | undefined }) => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const { comments, status } = useSelector((state: RootState) => state.comment);
    const [comment, setComment] = useState<string>('')
    const [showModal, setShowModal] = useState<boolean>(false);
    const [commentIdDelete, setCommentIdDelete] = useState<string | number | null>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const profilePicture = currentUser?.profilePicture
        // @ts-ignore
        ? `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/userAvatar/${currentUser.profilePicture}`
        : currentUser?.profilePicture.startsWith('https')
            ? currentUser?.profilePicture
            : defaultAvatar;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (comment.length > 200) return;

        try {
            if (currentUser) {
                dispatch(createComment({ contentComment: comment, postId, currentUserId: currentUser._id })).unwrap();
            }
            toast.success("You created the comment successfuly");
            setComment('')
        } catch (error: any) {
            console.log(error.message);
            toast.error(status);
        }
    }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await dispatch(getPostComments({ postId })).unwrap();
                if (response.comments.length === 0) return;
            } catch (error: any) {
                toast.error(error.message);
                console.log(error.message);
            }
        }

        fetchComments();
    }, [postId]);

    const handleLike = useCallback(async (commentId: string | number) => {
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }

            dispatch(addLikeComment({ commentId })).unwrap();
        } catch (error: any) {
            toast.error(error.message);
            console.log(error.message);
        }
    }, [currentUser, dispatch, navigate]);

    const handleDelete = useCallback(async (commentId: string | number | null) => {
        setShowModal(false)

        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }

            const response = await dispatch(deleteComments({ commentIdDelete: commentId })).unwrap();
            toast.success(response.message);
            setShowModal(false);
        } catch (error: any) {
            toast.error(error.message);
            console.log(error.message);
        }
    }, [currentUser, dispatch, navigate]);


    if (!comments || !currentUser) return <div>Loading...</div>

    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {currentUser ? (
                <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Signed in as: </p>
                    <img className='w-5 h-5 object-cover rounded-full' src={profilePicture} alt="pictureProfile" />
                    <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>
                        @{currentUser.username}
                    </Link>
                </div>
            ) : (
                <div className='text-sm text-teal-500 my-5 flex gap-1'>
                    You must be signed in to comment.
                    <Link to={'/sign-in'} className='text-blue-500 hover:underline'>Sign In</Link>
                </div>
            )}

            {currentUser && (
                <CommentForm 
                    onSubmit={handleSubmit}
                    commentContent={comment}
                    setComment = {setComment}
                />
            )}

            {comments.length === 0 ? (
                <p className='text-sm my-5'>No comments yet</p>
            ) : (
                <CommentList
                    comments={comments}
                    onLike={handleLike}
                    onDelete={handleDelete}
                />
            )}

            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500! dark:text-gray-400'>Are you sure you want to delete the comment?</h3>

                        <div className="flex justify-between items-center gap-4">
                            <Button className='text-xl text-red-500' color={'failure'} onClick={() => handleDelete(commentIdDelete)}>
                                Yes, I am sure
                            </Button>
                            <Button className='text-xl text-white' color={'failure'} onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default CommentSection