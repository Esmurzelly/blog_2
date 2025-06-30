import { useState, useEffect } from 'react'
import { Button, Modal, ModalBody, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaAngleLeft, FaAngleRight, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from './Loader';
import { useDispatch } from 'react-redux';
import { deletePost, getPosts } from '../redux/posts/postSlice';
import Pagination from './Pagination';

const DashPosts = () => {
  const { currentUser } = useSelector(state => state.user);
  const { posts, totalPosts } = useSelector(state => state.posts);
  const [showMore, setShowMore] = useState(true);
  const [showLess, setShowLess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [postIdDelete, setPostIdDelete] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const dispatch = useDispatch();

  const [pageNumber, setPageNumber] = useState(1);
  const POSTS_PER_PAGE = 9;

  const fetchPostsByPage = async (page) => {
    const newStartIndex = (page - 1) * POSTS_PER_PAGE;

    try {
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('startIndex', newStartIndex);
      const searchQuery = urlParams.toString();

      const response = await dispatch(getPosts({ searchQuery }));

      setStartIndex(newStartIndex);
      setPageNumber(page);
      setShowMore(page < Math.ceil(totalPosts / POSTS_PER_PAGE));
      setShowLess(page > 1);
    } catch (error) {
      console.log(error.message);
      toast.error("Unable to load users");
    }
  };

  const handleShowMore = () => {
    fetchPostsByPage(pageNumber + 1);
  };

  const handleShowBack = () => {
    fetchPostsByPage(pageNumber - 1);
  };

  const handleGoToStart = () => {
    fetchPostsByPage(1);
  };

  const handleGoToEnd = () => {
    fetchPostsByPage(Math.ceil(totalPosts / POSTS_PER_PAGE));
  };

  useEffect(() => {
    if (currentUser.isAdmin) fetchPostsByPage(1);
  }, [currentUser]);

  const handleDeletePost = async () => {
    setShowModal(false);

    try {
      dispatch(deletePost({ postId: postIdDelete, currentUserId: currentUser._id }))

      toast.success("You deleted the posts successfuly");
    } catch (error) {
      console.log(error.message);
      toast.error("You can't delete the posts");
    }
  }

  return (
    <div className='w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300'>
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
                <TableRow className='bg-white'>
                  <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>

                  <TableCell>
                    <Link to={`/post/${post._id}`}>
                      <img className='w-20 h-10 object-cover bg-gray-500' src={post.image.startsWith('http')
                        ? post.image
                        : `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/postImage/${post.image}`} alt={post.title} />
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Link className='font-medium text-gray-900' to={`/post/${post._id}`}>{post.title}</Link>
                  </TableCell>

                  <TableCell>{post.category}</TableCell>

                  <TableCell>
                    <span onClick={() => {
                      setShowModal(true);
                      setPostIdDelete(post._id)
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
              </TableBody>
            ))}
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