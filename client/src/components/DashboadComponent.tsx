import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { getUsers } from '../redux/user/userSlice';
import { getComments } from '../redux/comments/commentSlice';
import { getPosts } from '../redux/posts/postSlice';
import { RootState, useAppDispatch } from '../redux/store';
import Loader from './Loader';
import { toast } from 'react-toastify';
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi';
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import defaultAvatar from '../assets/user.png'

const DashboadComponent = () => {
    const { currentUser, users, totalUsers, lastMonthUsers, loading: userLoading } = useSelector((state: RootState) => state.user);
    const { comments, totalComments, lastMonthComments, loading: commentLoading } = useSelector((state: RootState) => state.comment);
    const { posts, totalPosts, lastMonthPosts, loading: postsLoading } = useSelector((state: RootState) => state.posts);

    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                dispatch(getUsers({ startIndex: 0 }));
            } catch (error) {
                toast.error("Can't find users");
            }
        }

        const fetchComments = async () => {
            try {
                dispatch(getComments({ startIndex: 0 }));
            } catch (error) {
                toast.error("Can't find comments");
            }
        }

        const fetchPosts = async () => {
            const urlParams = new URLSearchParams(location.search);
            const searchQuery = urlParams.toString();
            urlParams.set('startIndex', '0');

            try {
                dispatch(getPosts({ searchQuery }));
            } catch (error) {
                toast.error("Can't find posts");
            }
        }

        if (currentUser && currentUser.isAdmin) {
            fetchUsers();
            fetchComments();
            fetchPosts();
        }
    }, [currentUser]);

    if (!users ||
        !comments ||
        !posts ||
        !totalUsers ||
        !totalPosts ||
        !totalComments ||
        !lastMonthUsers ||
        !lastMonthPosts ||
        !lastMonthComments ||
        !currentUser ||
        userLoading ||
        commentLoading ||
        postsLoading
    ) return <Loader />

    return (
        <div className='p-3 md:mx-auto'>
            <div className="flex-wrap flex gap-4 justify-center">
                <div className="flex flex-col p-3 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className='dark:text-gray-300 text-md uppercase'>Total Users</h3>
                            <p className='text-2xl'>{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>

                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {lastMonthUsers}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>

                <div className='flex flex-col p-3 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className="">
                            <h3 className='dark:text-gray-300 text-md uppercase'>
                                Total Comments
                            </h3>
                            <p className='text-2xl'>{totalComments}</p>
                        </div>
                        <HiAnnotation className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>

                    <div className='flex  gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthComments}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>

                <div className='flex flex-col p-3 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='dark:text-gray-300 text-md uppercase'>Total Posts</h3>
                            <p className='text-2xl'>{totalPosts}</p>
                        </div>
                        <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>

                    <div className='flex  gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthPosts}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 xl:grid-cols-4 gap-4 py-3 mx-auto justify-center'>
                <div className='flex flex-col xl:col-span-1 w-full shadow-md p-2 rounded-md'>
                    <div className='flex justify-between  p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2'>Recent users</h1>
                        <Button className='bg-gradient-to-r from-purple-500 to-pink-500'>
                            <Link to={'/dashboard?tab=users'}>See all</Link>
                        </Button>
                    </div>

                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>User image</TableHeadCell>
                            <TableHeadCell>Username</TableHeadCell>
                        </TableHead>

                        {users && users.map((user) => (
                            <TableBody key={user._id} className='divide-y'>
                                <TableRow className='bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300'>
                                    <TableCell>
                                        <img src={user.profilePicture
                                            ? user?.profilePicture.startsWith('https') ? user?.profilePicture
                                                //@ts-ignore
                                                : `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/userAvatar/${user.profilePicture}`
                                            : defaultAvatar}
                                            alt='user'
                                            className='w-4 rounded-full bg-gray-500'
                                        />
                                    </TableCell>

                                    <TableCell>{user.username}</TableCell>
                                </TableRow>
                            </TableBody>
                        ))}
                    </Table>
                </div>

                <div className='flex flex-col xl:col-span-3 w-full shadow-md p-2 rounded-md'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2'>Recent comments</h1>
                        <Button className='bg-gradient-to-r from-purple-500 to-pink-500'>
                            <Link to={'/dashboard?tab=comments'}>See all</Link>
                        </Button>
                    </div>

                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>Comment content</TableHeadCell>
                            <TableHeadCell>Likes</TableHeadCell>
                        </TableHead>

                        {comments && comments.map((comment) => (
                            <TableBody key={comment._id} className='divide-y'>
                                <TableRow className='bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300'>
                                    <TableCell>{comment.content}</TableCell>

                                    <TableCell >{comment.numberOfLikes}</TableCell>
                                </TableRow>
                            </TableBody>
                        ))}
                    </Table>
                </div>

                <div className='flex flex-col xl:col-span-4 w-full shadow-md p-2 rounded-md'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2'>Recent posts</h1>
                        <Button className='bg-gradient-to-r from-purple-500 to-pink-500'>
                            <Link to={'/dashboard?tab=posts'}>See all</Link>
                        </Button>
                    </div>

                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>Post title</TableHeadCell>
                            <TableHeadCell>Post title</TableHeadCell>
                            {window.innerWidth >= 768 && <TableHeadCell>Category</TableHeadCell>}
                        </TableHead>

                        {posts && posts.map((post) => (
                            <TableBody key={post._id} className='divide-y'>
                                <TableRow className='bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300'>
                                    <TableCell>
                                        <img
                                            src={post.image
                                                ? post?.image.startsWith('https') ? post?.image
                                                    //@ts-ignore
                                                    : `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/postImage/${post.image}`
                                                : defaultAvatar}
                                            alt='user'
                                            className='w-10 h-10 object-cover rounded-md bg-gray-500'
                                        />
                                    </TableCell>
                                    <TableCell>{window.innerWidth < 768 && post.title.length > 11 ? `${post.title.slice(0, 10)}...` : post.title}</TableCell>
                                    {window.innerWidth >= 768 && <TableCell>{post.category === 'undefined' ? 'uncategorized' : post.category}</TableCell>}
                                </TableRow>
                            </TableBody>
                        ))}
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default DashboadComponent