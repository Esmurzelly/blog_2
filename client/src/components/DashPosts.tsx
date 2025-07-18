import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../redux/store';
import { deletePost, getPosts } from '../redux/posts/postSlice';
import Loader from './Loader';
import Pagination from './Pagination';
import { toast } from 'react-toastify';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Button, Modal, ModalBody, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';

const DashPosts = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { posts, totalPosts } = useSelector((state: RootState) => state.posts);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [postIdDelete, setPostIdDelete] = useState<string>('');
  const dispatch = useAppDispatch();

  const [pageNumber, setPageNumber] = useState<number>(1);
  const POSTS_PER_PAGE: number = 9;

  const fetchPostsByPage = useCallback(async (page: number) => {
    const newStartIndex = (page - 1) * POSTS_PER_PAGE;

    try {
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('startIndex', String(newStartIndex));
      const searchQuery = urlParams.toString();

      dispatch(getPosts({ searchQuery }));
      setPageNumber(page);
    } catch (error: any) {
      console.log(error.message);
      toast.error("Unable to load users");
    }
  }, [dispatch])

  const handleShowMore = useCallback(() => {
    fetchPostsByPage(pageNumber + 1);
  }, [fetchPostsByPage, pageNumber])

  const handleShowBack = useCallback(() => {
    fetchPostsByPage(pageNumber - 1);
  }, [fetchPostsByPage, pageNumber])

  const handleGoToStart = useCallback(() => {
    fetchPostsByPage(1);
  }, [fetchPostsByPage])

  const handleGoToEnd = useCallback(() => {
    fetchPostsByPage(Math.ceil(totalPosts / POSTS_PER_PAGE));
  }, [fetchPostsByPage, totalPosts])

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) fetchPostsByPage(1);
  }, [currentUser?.isAdmin, fetchPostsByPage]);

  const handleDeletePost = async () => {
    setShowModal(false);

    if (!currentUser) {
      toast.error("No user found");
      return;
    }

    try {
      await dispatch(deletePost({ postId: postIdDelete, currentUserId: currentUser._id })).unwrap();
      toast.success("You deleted the posts successfuly");
      setPostIdDelete('');
    } catch (error: any) {
      console.log(error.message);
      toast.error("You can't delete the posts");
    }
  }

  if (!posts || posts.length === 0) return <h1>No Posts</h1>

  return (
    <div className='w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300'>
      {currentUser && currentUser.isAdmin && posts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <TableHead>
              <TableRow>
                <TableHeadCell>Date updated</TableHeadCell>
                <TableHeadCell>Post image</TableHeadCell>
                <TableHeadCell>Post title</TableHeadCell>
                <TableHeadCell>Category</TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
                <TableHeadCell>
                  <span>Edit</span>
                </TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody className='divide-y'>
              {posts.map((post) => (
                <TableRow className='bg-white dark:bg-gray-700' key={post._id}>
                  <TableCell>
                    {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : 'N/A'}
                  </TableCell>

                  <TableCell>
                    <Link to={`/post/${post._id}`}>
                      <img className='w-20 h-10 object-cover bg-gray-500' src={post.image && post.image.startsWith('http')
                        ? post.image
                        // @ts-ignore
                        : `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/postImage/${post.image}`} alt={post.title} />
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Link className='font-medium text-gray-900 dark:text-gray-300' to={`/post/${post._id}`}>{post.title}</Link>
                  </TableCell>

                  <TableCell className='dark:text-gray-300'>{post.category === 'undefined' ? 'uncategorized' : post.category}</TableCell>

                  <TableCell>
                    <span onClick={() => {
                      setShowModal(true);
                      setPostIdDelete(post._id ?? '')
                    }} className='font-medium text-red-500 cursor-pointer'>
                      Delete
                    </span>
                  </TableCell>

                  <TableCell>
                    <Link className='text-teal-500' to={`/update-post/${post._id}`}>
                      <span>Edit</span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            pageNumber={pageNumber}
            totalItem={totalPosts}
            onFetchData={fetchPostsByPage}
            onStart={handleGoToStart}
            onEnd={handleGoToEnd}
            onShowMore={handleShowMore}
            onShowLess={handleShowBack}
          />
        </>
      ) : (
        <Loader />
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className='w-14 h-14 text-gray-400 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-white'>Are you sure you want to delete your post?</h3>

            <div className="flex justify-between items-center gap-4">
              <Button className='text-xl text-red-500 cursor-pointer' color={'failure'} onClick={handleDeletePost}>
                Yes, I am sure
              </Button>
              <Button className='text-xl text-white cursor-pointer' color={'failure'} onClick={() => setShowModal(false)}>
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