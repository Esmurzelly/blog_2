import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const DashPosts = () => {
  const { currentUser } = useSelector(state => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  console.log('userPosts', userPosts);

  const handleShowMore = async () => {
    const startIndex = userPosts.length; // 9

    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json()

      if(res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);

        if(data.posts.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("You can't get more posts");
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);
          // toast.success("You got the posts successfuly");

          if (data.posts.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
        toast.error("You can't get the posts");
      }
    };

    if (currentUser.isAdmin) fetchPosts();
  }, [currentUser]);

  return (
    <div className='w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md border'>
            <TableHead>
              <TableHeadCell>Date updated</TableHeadCell>
              <TableHeadCell>Post image</TableHeadCell>
              <TableHeadCell>Post title</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
              <TableHeadCell>
                <span>Edit</span>
              </TableHeadCell>
            </TableHead>

            {userPosts.map((post) => (
              <TableBody className='divide-y'>
                <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>

                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image.startsWith('http')
                        ? post.image
                        : `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/postImage/${post.image}`} alt={post.title} className='w-20 h-10 object-cover bg-gray-500' />
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>{post.title}</Link>
                  </TableCell>

                  <TableCell>{post.category}</TableCell>

                  <TableCell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
                  </TableCell>

                  <TableCell>
                    <Link className='text-teal-500' to={`/update-post/${post._id}`}>
                      <span className='hover:underline'>Edit</span>
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>

          {showMore && (
            <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
              Show More
            </button>
          )}
        </>
      ) : (
        <p>You don't have posts</p>
      )}
    </div>
  )
}

export default DashPosts