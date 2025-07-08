import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../redux/posts/postSlice';
import { RootState, useAppDispatch } from '../redux/store';

const Home = () => {
  const { posts, loading } = useSelector((state: RootState) => state.posts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      const urlParams = new URLSearchParams(location.search);

      const searchQuery = urlParams.toString();
      urlParams.set('startIndex', '0');

      dispatch(getPosts({ searchQuery }));
    }

    fetchPosts();
  }, []);

  if (!posts || loading) {
    return <Loader />
  }

  return (
    <div>
      <div className='flex flex-col gap-6 p-10 px-3 max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl pt-10'>Welcome to my Blog</h1>
        <p className='text-gray-500 dark:text-gray-300 text-xs sm:text-sm'>
          Welcome to my blog! Here you'll find a wide range of articles,
          tutorials, and resources designed to help you grow as a developer.
          Whether you're interested in web development, software engineering,
          programming languages, or best practices in the tech industry, there's
          something here for everyone. Dive in and explore the content to expand
          your knowledge and skills.
        </p>

        <Link to={'/search'} className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>
          View all posts
        </Link>

        <div className='p-3 bg-amber-100'>
          <CallToAction />
        </div>
      </div>

      <div className='max-w-7xl mx-auto p-3 flex flex-col gap-8 py-3'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>

            <div className='grid justify-between grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4'>
              {posts.map((postItem) => (
                <PostCard key={postItem._id} post={postItem} />
              ))}
            </div>

            <Link
              to={'/search'}
              className='mx-auto text-lg text-teal-500 text-center p-3 cursor-pointer outline hover:bg-teal-500 hover:text-white transition-all duration-300 m-6'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home