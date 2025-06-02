import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import defaultAvatar from '../assets/user.png'
import moment from 'moment';
import { RiThumbUpLine } from "react-icons/ri";
import { Button, Textarea } from 'flowbite-react';

const Comment = ({ comment, onLike, onEdit }) => {
    const [user, setUser] = useState({});
    const { currentUser } = useSelector(state => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    const profilePicture = user?.profilePicture
        ? `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/userAvatar/${user.profilePicture}`
        : user?.profilePicture?.startsWith('https')
            ? user?.profilePicture
            : defaultAvatar;

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/getuser/${comment.userId}`);
                const data = await res.json();

                if (res.ok) {
                    setUser(data);
                }
            } catch (error) {
                console.log(error.message);
                toast.error(error.message);
            }
        }

        getUser();
    }, [comment]);

    const handleEdit = async () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    }

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: editedContent
                })
            });

            if(res.ok) {
                setIsEditing(false);
                onEdit(comment, editedContent);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    return (
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
            <div className="flex-shrink-0 mr-3">
                <img className='w-10 h-10 rounded-full bg-gray-200' src={profilePicture} alt="profilePicture" />
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : "anonymous user"}</span>
                    <span className='text-gray-500 text-xs'>
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>

                {isEditing ? (
                    <>
                        <Textarea
                            className='mb-2'
                            type='text'
                            rows={'3'}
                            value={editedContent}
                            onChange={e => setEditedContent(e.target.value)}
                        />

                        <div className="flex justify-end gap-2 text-xs">
                            <Button onClick={handleSave} type='button' size='sm' className='bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer'>Save</Button>
                            <Button onClick={() => setIsEditing(false)} type='button' size='sm' className='bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer'>Cancel</Button>
                        </div>
                    </>

                ) : (
                    <>
                        <p className='text-gray-500 pb-2'>{comment.content}</p>

                        <div className="flex items-center gap-2 pt-2 text-xs border-t dark:border-gray-700 max-w-fit">
                            <button
                                type='button'
                                onClick={() => onLike(comment._id)}
                                className={`hover:text-blue-500 cursor-pointer 
                            ${currentUser && comment.likes.includes(currentUser._id) ? 'text-blue-500' : 'text-gray-400'}`
                                }
                            >
                                <RiThumbUpLine className='text-sm' />
                            </button>

                            <p className='text-gray-400'>{
                                comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes")
                            }</p>

                            {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                <button
                                    type='button'
                                    className='text-gray-400 hover:text-blue-500 cursor-pointer'
                                    onClick={handleEdit}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}

export default Comment