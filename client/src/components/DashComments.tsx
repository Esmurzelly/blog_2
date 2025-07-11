import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, ModalBody, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from './Loader';
import { getComments, deleteComments } from '../redux/comments/commentSlice';
import Pagination from './Pagination';
import { RootState, useAppDispatch } from '../redux/store';

const DashCommets = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const { comments, totalComments } = useSelector((state: RootState) => state.comment);
    const dispatch = useAppDispatch();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [commentIdDelete, setCommentIdDelete] = useState<string>('');

    const [pageNumber, setPageNumber] = useState<number>(1);
    const COMMENTS_PER_PAGE: number = 9;

    const fetchCommentsByPage = useCallback(async (page: number) => {
        const newStartIndex = (page - 1) * COMMENTS_PER_PAGE;

        try {
            await dispatch(getComments({ startIndex: newStartIndex, limit: COMMENTS_PER_PAGE })).unwrap();
            setPageNumber(page);
        } catch (error: any) {
            console.log(error.message);
            toast.error("Unable to load users");
        }
    }, [dispatch]);

    const handleShowMore = useCallback(() => {
        fetchCommentsByPage(pageNumber + 1);
    }, [fetchCommentsByPage, pageNumber]);

    const handleShowBack = useCallback(() => {
        fetchCommentsByPage(pageNumber - 1);
    }, [fetchCommentsByPage, pageNumber]);

    const handleGoToStart = useCallback(() => {
        fetchCommentsByPage(1);
    }, [fetchCommentsByPage]);

    const handleGoToEnd = useCallback(() => {
        fetchCommentsByPage(Math.ceil(totalComments / COMMENTS_PER_PAGE));
    }, [fetchCommentsByPage, totalComments]);

    useEffect(() => {
        if (currentUser && currentUser.isAdmin) fetchCommentsByPage(1);
    }, [currentUser?.isAdmin, fetchCommentsByPage]);

    const handleDeleteComments = async () => {
        try {
            const response = await dispatch(deleteComments({ commentIdDelete })).unwrap();
            toast.success(response.message);
            setShowModal(false);
            setCommentIdDelete('');
        } catch (error) {
            console.log(error)
            toast.error("You can't delete the comment");
        }
    }

    if (!comments || comments.length === 0) return <h1>No Comments</h1>

    return (
        <div className='w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300'>
            {currentUser && currentUser.isAdmin && comments.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Date updated</TableHeadCell>
                                <TableHeadCell>Comment content</TableHeadCell>
                                <TableHeadCell>Number of likes</TableHeadCell>
                                <TableHeadCell>PostId</TableHeadCell>
                                <TableHeadCell>UserId</TableHeadCell>
                                <TableHeadCell>Delete</TableHeadCell>
                            </TableRow>
                        </TableHead>

                        <TableBody className='divide-y'>
                            {comments.map((commentItem) => (
                                <TableRow className='bg-white dark:bg-gray-700' key={commentItem._id}>
                                    <TableCell>{commentItem.updatedAt
                                        ? new Date(commentItem.updatedAt).toLocaleDateString()
                                        : 'N/A'}</TableCell>

                                    <TableCell>
                                        <p className='font-medium text-gray-900 dark:text-gray-300'>{commentItem.content}</p>
                                    </TableCell>

                                    <TableCell>
                                        <p className='font-medium text-gray-900 dark:text-gray-300'>{commentItem.numberOfLikes}</p>
                                    </TableCell>

                                    <TableCell>
                                        <p className='font-medium text-gray-900 dark:text-gray-300'>{commentItem.postId}</p>
                                    </TableCell>

                                    <TableCell>
                                        <p className='font-medium text-gray-900 dark:text-gray-300'>{commentItem.userId}</p>
                                    </TableCell>

                                    <TableCell>
                                        <span onClick={() => {
                                            setShowModal(true);
                                            setCommentIdDelete(commentItem._id)
                                        }} className='font-medium text-red-500 cursor-pointer'>
                                            Delete
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Pagination
                        pageNumber={pageNumber}
                        totalItem={totalComments}
                        onFetchData={fetchCommentsByPage}
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
                        <h3 className='mb-5 text-lg text-white'>Are you sure you want to delete the comment?</h3>

                        <div className="flex justify-between items-center gap-4">
                            <Button className='text-xl text-red-500 cursor-pointer' color={'failure'} onClick={handleDeleteComments}>
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

export default DashCommets