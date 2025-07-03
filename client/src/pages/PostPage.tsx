import { Button } from 'flowbite-react';
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentPost, getPosts } from '../redux/posts/postSlice';

const PostPage = () => {
    const { postId } = useParams();
    const dispatch = useDispatch();

    const { currentPost, posts, loading, status } = useSelector(state => state.posts);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                dispatch(getCurrentPost({ postId }));
            } catch (error) {
                toast.error(error || status);
                console.log(error || status)
            }
        };
        fetchPost();
    }, [postId]);

    useEffect(() => {
        try {
            const fetchRecentPosts = async () => {
                const searchQuery = 'limit=3';
                dispatch(getPosts({ searchQuery }));
            }
            fetchRecentPosts();
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }, []);

    if (loading) return <Loader />

    return (
        <main className='p-3 flex flex-col w-full mx-auto min-h-screen'> {/* max-w-6xl mx */}
            <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl wrap-break-word mx-auto lg:text-4xl font-semibold'>
                {currentPost && currentPost.title}
            </h1>

            <Link to={`/search?category=${currentPost?.category}`} className='self-center mt-5'>
                <Button color={'gray'} pill size='xs'>{currentPost && (currentPost.category === 'undefined' ? 'uncategorized' : currentPost.category)}</Button>                
            </Link>

            <img
                src={currentPost?.image.includes('http') ? currentPost?.image : `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/postImage/${currentPost?.image}`}
                alt={currentPost && currentPost?.title}
                className='mt-10 p-3 max-h-[600px] w-full mx-auto object-cover'
            />

            <div className="flex items-center justify-between p-3 border-b border-slate-500 text-xs mx-auto w-full max-w-2xl">
                <span>{currentPost && new Date(currentPost?.createdAt).toLocaleDateString()}</span>
                <span className='italic'>{currentPost && (currentPost?.content.length / 1000).toFixed(0)} mins read</span>
            </div>

            <div className="p-3 max-w-2xl mx-auto w-full post-content wrap-break-word" dangerouslySetInnerHTML={{ __html: currentPost && currentPost.content }}></div>

            <div className="max-w-4xl mx-auto w-full">
                <CallToAction />
            </div>

            <CommentSection postId={currentPost?._id} />

            <div className='flex flex-col justify-center items-center mb-5'>
                <h1 className='text-xl mt-5'>Recent articles</h1>
                <div className='flex flex-wrap gap-5 mt-5 justify-center'>
                    {posts &&
                        posts.map((post) => <PostCard key={post._id} post={post} />)}
                </div>
            </div>
        </main>
    )
}

export default PostPage