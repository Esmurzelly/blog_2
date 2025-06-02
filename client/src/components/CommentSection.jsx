import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import defaultAvatar from '../assets/user.png'
import { Button, Modal, ModalBody, ModalHeader, Textarea } from 'flowbite-react';
import { toast } from 'react-toastify';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector(state => state.user);
    const [comment, setComment] = useState('')
    const [commentsList, setCommentsList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const navigate = useNavigate();

    const profilePicture = currentUser?.profilePicture
        ? `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/userAvatar/${currentUser.profilePicture}`
        : currentUser?.profilePicture.startsWith('https')
            ? currentUser?.profilePicture
            : defaultAvatar;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (comment.length > 200) return;

        try {
            const res = await fetch('/api/comment/create', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id
                })
            })

            const data = await res.json();

            if (res.ok) {
                setComment('');
                setCommentsList([data, ...commentsList])
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`);

                if (res.ok) {
                    const data = await res.json();
                    setCommentsList(data);
                }
            } catch (error) {
                toast.error(error.message);
                console.log(error.message);
            }
        }

        getComments();
    }, [postId]);

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }

            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: "PUT",
            });

            if (res.ok) {
                const data = await res.json();
                setCommentsList((prevComments) =>
                    prevComments.map((commentItem) =>
                        commentItem._id === commentId ? {
                            ...commentItem,
                            likes: data.likes,
                            numberOfLikes: data.numberOfLikes,
                        } : commentItem
                    )
                )
            }

        } catch (error) {
            toast.error(error.message);
            console.log(error.message);
        }
    }

    const handleEdit = async (comment, editedComment) => {
        setCommentsList(
            commentsList.map((c) =>
                c._id === comment._id ? { ...c, content: editedComment } : c
            )
        )
    };

    const handleDelete = async (commentId) => {
        setShowModal(false)

        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }

            const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                const data = await res.json();
                setCommentsList(commentsList.filter((comment) => comment._id !== commentId));
                toast.success(data);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error.message);
        }
    }

    if (!commentsList || !currentUser) return <div>Loading...</div>

    console.log(commentsList)

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
                <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
                    <Textarea
                        placeholder='Add a comment...'
                        type='text'
                        rows={'3'}
                        maxLength={'200'}
                        onChange={e => setComment(e.target.value)}
                        value={comment}
                    />

                    <div className="flex justify-between items-center mt-5">
                        <p className='text-gray-500 text-xs'>{200 - comment.length} characters remaining</p>
                        <Button outline className='bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer text-white!' type='submit'>Submit</Button>
                    </div>
                </form>
            )}

            {commentsList.length === 0 ? (
                <p className='text-sm my-5'>No comments yet</p>
            ) : (
                <>
                    <div className='text-sm my-5 flex items-center gap-1'>
                        <p>Comments</p>
                        <div className="border border-gray-400 py-1 px-2 rounded-sm">
                            <p>{commentsList.length}</p>
                        </div>
                    </div>

                    {commentsList && commentsList.map((commentItem) => (
                        <Comment
                            key={commentItem._id}
                            comment={commentItem}
                            onLike={handleLike}
                            onEdit={handleEdit}
                            onDelete={(commentId) => {
                                setShowModal(true)
                                setCommentToDelete(commentId)
                            }}
                        />
                    ))}
                </>
            )}

            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500! dark:text-gray-400'>Are you sure you want to delete the comment?</h3>

                        <div className="flex justify-between items-center gap-4">
                            <Button className='text-xl text-red-500' color={'failure'} onClick={() => handleDelete(commentToDelete)}>
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