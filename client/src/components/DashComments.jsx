import { useState, useEffect } from 'react'
import { Button, Modal, ModalBody, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import Loader from './Loader';
import { getComments, deleteComments } from '../redux/comments/commentSlice';

const DashCommets = () => {
    const { currentUser } = useSelector(state => state.user);
    const { comments, totalComments } = useSelector(state => state.comment)
    const dispatch = useDispatch();
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdDelete, setCommentIdDelete] = useState('');
    const [startIndex, setStartIndex] = useState(9);

    const handleShowMore = async () => {
        if (startIndex > totalComments) return;

        try {
            const response = await dispatch(getComments({ startIndex, limit: 9 })).unwrap();

            const newComments = response.comments || [];
            console.log('newComments', newComments, newComments.length)
            setStartIndex(prev => prev + 9);

            if (startIndex + newComments.length >= totalComments) {
                setShowMore(false);
            } else {
                setShowMore(true);
            };
        } catch (error) {
            console.log(error.message);
            toast.error("You can't get more posts");
        }
    }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await dispatch(getComments({ startIndex: 0, limit: 9 })).unwrap();
                if (response.comments.length < 9) setShowMore(false);
                toast.success("You got the comments successfuly");
            } catch (error) {
                console.log(error.message);
                toast.error("You can't get the comments list");
            }
        };

        if (currentUser.isAdmin) fetchComments();
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

                    <div className="flex justify-center mt-4">
                        {showMore && (
                            <button onClick={handleShowMore} className='text-teal-500 text-center text-sm p-3 cursor-pointer outline hover:bg-teal-500 hover:text-white transition-all duration-300'>
                                Show More
                            </button>
                        )}
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