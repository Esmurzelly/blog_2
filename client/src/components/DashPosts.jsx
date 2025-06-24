import { Button, Modal, ModalBody, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import React, { useState, useEffect } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from './Loader';
import { useDispatch } from 'react-redux';
import { deletePost, getPosts } from '../redux/posts/postSlice';

const DashPosts = () => {
  const { currentUser } = useSelector(state => state.user);
  const { posts, totalPosts } = useSelector(state => state.posts);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdDelete, setPostIdDelete] = useState('');
  const dispatch = useDispatch();
  const [startIndex, setStartIndex] = useState(9);


  const handleShowMore = async () => {
    if (startIndex >= totalPosts) return;

    console.log('startIndex', startIndex);
    console.log('totalPosts', totalPosts);

    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);

    const searchQuery = urlParams.toString();
    console.log('searchQuery', searchQuery);

    const response = await dispatch(getPosts({ searchQuery }));

    console.log('response from handleShow func', response);

    const newPosts = response.payload.posts || [];
    setStartIndex(prev => prev + 9);

    if (startIndex + newPosts.length >= totalPosts) {
      setShowMore(false)
    } else {
      setShowMore(true)
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const searchQuery = urlParams.toString();

        const response = await dispatch(getPosts({ searchQuery }));
      } catch (error) {
        console.log(error.message);
        toast.error("You can't get the posts");
      }
    };

    if (currentUser.isAdmin) fetchPosts();
  }, [currentUser]);

  const handleDeletePost = async () => {
    setShowModal(false);

    try {
      const response = await dispatch(deletePost({ postId: postIdDelete, currentUserId: currentUser._id }))

      toast.success("You deleted the posts successfuly");
    } catch (error) {
      console.log(error.message);
      toast.error("You can't delete the posts");
    }
  }

  return (
    <div className='w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && posts.length > 0 ? (
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

            {posts.map((post) => (
              <TableBody className='divide-y'>
                <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>

                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <img className='w-20 h-10 object-cover bg-gray-500' src={post.image.startsWith('http')
                        ? post.image
                        : `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/postImage/${post.image}`} alt={post.title} />
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>{post.title}</Link>
                  </TableCell>

                  <TableCell>{post.category}</TableCell>

                  <TableCell>
                    <span onClick={() => {
                      setShowModal(true);
                      setPostIdDelete(post._id)
                    }} className='font-medium text-red-500 hover:underline cursor-pointer'>
                      Delete
                    </span>
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
        <Loader />
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500! dark:text-gray-400'>Are you sure you want to delete your post?</h3>

            <div className="flex justify-between items-center gap-4">
              <Button className='text-xl text-red-500' color={'failure'} onClick={handleDeletePost}>
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

export default DashPosts