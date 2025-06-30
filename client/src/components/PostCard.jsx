import React from 'react'
import { Link } from 'react-router-dom'

const PostCard = ({ post }) => {
    return (
        <div className='group relative w-full 2xl:w-[350px] border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all mx-auto'>
            <Link to={`/post/${post._id}`}>
                <img
                    className='h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20'
                    src={post?.image && post?.image.includes('http') ? post?.image : `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/postImage/${post?.image}`}
                    alt="image"
                />
            </Link>

            <div className="p-3 flex flex-col gap-2">
                <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
                <span className='italic text-sm'>{post.category}</span>
                <Link
                    to={`/post/${post._id}`}
                    className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 
                    hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md rounded-tl-none m-3'
                >
                    Read article
                </Link>
            </div>
        </div>
    )
}

export default PostCard