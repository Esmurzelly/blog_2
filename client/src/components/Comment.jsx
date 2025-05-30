import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import defaultAvatar from '../assets/user.png'
import moment from 'moment';

const Comment = ({ comment }) => {
    const [user, setUser] = useState({});

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

    console.log('user', user);

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
                <p className='text-gray-500 pb-2'>{comment.content}</p>
            </div>
        </div>
    )
}

export default Comment