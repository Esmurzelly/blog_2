import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

const PostPage = () => {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();
                if (!res.ok) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                if (res.ok) {
                    setPost(data.posts[0]);
                    setLoading(false);
                    setError(false);
                }
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchPost();
    }, [postSlug]);

    useEffect(() => {
        try {
            const fetchRecentPosts = async () => {
                const res = await fetch(`/api/post/getposts?limit=3`);
                const data = await res.json();

                if (res.ok) {
                    setRecentPosts(data.posts);
                }
            }
            fetchRecentPosts();
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size='xl' />
            </div>
        )
    }

    return (
        <main className='p-3 flex flex-col w-full mx-auto min-h-screen'> {/* max-w-6xl mx */}
            <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl font-semibold'>{post && post.title}</h1>

            <Link to={`/search?category=${post?.category}`} className='self-center mt-5'>
                <Button color={'gray'} pill size='xs'>{post && post.category}</Button>
            </Link>

            <img
                src={post?.image.includes('http') ? post?.image : `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/postImage/${post?.image}`}
                alt={post && post?.title}
                className='mt-10 p-3 max-h-[600px] w-full mx-auto object-cover'
            />

            <div className="flex items-center justify-between p-3 border-b border-slate-500 text-xs mx-auto w-full max-w-2xl">
                <span>{post && new Date(post?.createdAt).toLocaleDateString()}</span>
                <span className='italic'>{post && (post?.content.length / 1000).toFixed(0)} mins read</span>
            </div>

            <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{ __html: post && post.content }}></div>

            <div className="max-w-4xl mx-auto w-full">
                <CallToAction />
            </div>

            <CommentSection postId={post._id} />

            <div className='flex flex-col justify-center items-center mb-5'>
                <h1 className='text-xl mt-5'>Recent articles</h1>
                <div className='flex flex-wrap gap-5 mt-5 justify-center'>
                    {recentPosts &&
                        recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
                </div>
            </div>
        </main>
    )
}

export default PostPage