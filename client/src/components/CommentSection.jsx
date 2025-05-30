import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import defaultAvatar from '../assets/user.png'
import { Button, Textarea } from 'flowbite-react';
import { toast } from 'react-toastify';
import Comment from './Comment';

const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector(state => state.user);
    const [comment, setComment] = useState('')
    const [commentsList, setCommentsList] = useState([]);

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
                console.log(error.message)
            }
        }

        getComments();
    }, [postId]);

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

                    {commentsList.map((commentItem) => (
                        <Comment comment={commentItem} key={commentItem._id} />
                    ))}
                </>
            )}
        </div>
    )
}

export default CommentSection