import { useState, useEffect } from 'react'
import { Button, Modal, ModalBody, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import Loader from './Loader';
import { getComments, deleteComments } from '../redux/comments/commentSlice';
import { FaAngleLeft, FaAngleRight, FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';

const DashCommets = () => {
    const { currentUser } = useSelector(state => state.user);
    const { comments, totalComments } = useSelector(state => state.comment)
    const dispatch = useDispatch();
    const [showMore, setShowMore] = useState(true);
    const [showLess, setShowLess] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [commentIdDelete, setCommentIdDelete] = useState('');
    const [startIndex, setStartIndex] = useState(9);

    const [pageNumber, setPageNumber] = useState(1);
    const COMMENTS_PER_PAGE = 9;

    const fetchCommentsByPage = async (page) => {
        const newStartIndex = (page - 1) * COMMENTS_PER_PAGE;

        try {
            const response = await dispatch(getComments({ startIndex: newStartIndex, limit: COMMENTS_PER_PAGE })).unwrap();
            const newComments = response.comments || [];

            setStartIndex(newStartIndex);
            setPageNumber(page);
            setShowMore(page < Math.ceil(totalComments / COMMENTS_PER_PAGE));
            setShowLess(page > 1);
        } catch (error) {
            console.log(error.message);
            toast.error("Unable to load users");
        }
    };

    const handleShowMore = () => {
        fetchCommentsByPage(pageNumber + 1);
    };

    const handleShowBack = () => {
        fetchCommentsByPage(pageNumber - 1);
    };

    const handleGoToStart = () => {
        fetchCommentsByPage(1);
    };

    const handleGoToEnd = () => {
        fetchCommentsByPage(Math.ceil(totalComments / COMMENTS_PER_PAGE));
    };

    useEffect(() => {
        if (currentUser.isAdmin) fetchCommentsByPage(1);
    }, [currentUser]);

    const handleDeleteComments = async () => {
        try {
            const response = await dispatch(deleteComments({ commentIdDelete })).unwrap();

            // types of checking the error
            // if (response.type === 'comment/deleteComments/rejected') {
            //     toast.error(response.payload?.message || 'Failed to delete comment');
            //     return;
            // }

            // if (deleteComments.rejected.match(response)) {
            //     toast.error(response.payload?.message || 'Failed to delete comment');
            //     return;
            // }

            toast.success(response.message);
            setShowModal(false);
        } catch (error) {
            console.log(error)
            toast.error("You can't delete the comment");
        }
    }

    if (!comments || comments.length === 0) return <h1>No Comments</h1>

    return (
        <div className='w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && comments.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md border'>
                        <TableHead>
                            <TableHeadCell>Date updated</TableHeadCell>
                            <TableHeadCell>Comment content</TableHeadCell>
                            <TableHeadCell>Number of likes</TableHeadCell>
                            <TableHeadCell>PostId</TableHeadCell>
                            <TableHeadCell>UserId</TableHeadCell>
                            <TableHeadCell>Delete</TableHeadCell>
                        </TableHead>

                        {comments.map((commentItem) => (
                            <TableBody className='divide-y' key={commentItem._id}>
                                <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <TableCell>{new Date(commentItem.updatedAt).toLocaleDateString()}</TableCell>

                                    <TableCell>
                                        <p className='font-medium text-gray-900 dark:text-white'>{commentItem.content}</p>
                                    </TableCell>

                                    <TableCell>
                                        <p className='font-medium text-gray-900 dark:text-white'>{commentItem.numberOfLikes}</p>
                                    </TableCell>

                                    <TableCell>
                                        <p className='font-medium text-gray-900 dark:text-white'>{commentItem.postId}</p>
                                    </TableCell>

                                    <TableCell>
                                        <p className='font-medium text-gray-900 dark:text-white'>{commentItem.userId}</p>
                                    </TableCell>

                                    <TableCell>
                                        <span onClick={() => {
                                            setShowModal(true);
                                            setCommentIdDelete(commentItem._id)
                                        }} className='font-medium text-red-500 hover:underline cursor-pointer'>
                                            Delete
                                        </span>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ))}
                    </Table>

                    <div className="flex justify-center items-center mt-4 gap-2">
                        <div className="mr-3 flex items-center">
                            <FaAnglesLeft className='w-6 cursor-pointer' onClick={handleGoToStart} />
                            <FaAngleLeft className='w-6 cursor-pointer' onClick={handleShowBack} />
                        </div>

                        {[...Array(Math.ceil(totalComments / COMMENTS_PER_PAGE)).keys()].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => fetchCommentsByPage(i + 1)}
                                className={`cursor-pointer text-sm px-3 py-1 rounded transition ${pageNumber === i + 1
                                    ? 'bg-teal-500 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <div className="ml-3 flex items-center">
                            <FaAngleRight className='w-6 cursor-pointer' onClick={handleShowMore} />
                            <FaAnglesRight className='w-6 cursor-pointer' onClick={handleGoToEnd} />
                        </div>
                    </div>
                </>
            ) : (
                <Loader />
            )}

            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500! dark:text-gray-400'>Are you sure you want to delete the comment?</h3>

                        <div className="flex justify-between items-center gap-4">
                            <Button className='text-xl text-red-500' color={'failure'} onClick={handleDeleteComments}>
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

export default DashCommets