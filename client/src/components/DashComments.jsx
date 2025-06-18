import { useState, useEffect } from 'react'
import { Button, Modal, ModalBody, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import Loader from './Loader';

const DashCommets = () => {
    const { currentUser } = useSelector(state => state.user);
    const [commentsList, setCommentsList] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdDelete, setCommentIdDelete] = useState('');

    const handleShowMore = async () => {
        const startIndex = commentsList.length;

        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            const data = await res.json()

            if (res.ok) {
                setCommentsList((prev) => [...prev, ...data.users]);

                if (data.users.length < 9) setShowMore(false);
            }
        } catch (error) {
            console.log(error.message);
            toast.error("You can't get more posts");
        }
    }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments`);
                const data = await res.json();

                if (res.ok) {
                    setCommentsList(data.comments);
                    toast.success("You got the posts successfuly");

                    if (data.comments.length < 9) setShowMore(false);
                }
            } catch (error) {
                console.log(error.message);
                toast.error("You can't get the comments list"); // it calls anyway
            }
        };

        if (currentUser.isAdmin) fetchComments();
    }, [currentUser]);

    const handleDeleteComments = async () => {
        try {
            const res = await fetch(`/api/comment/deleteComment/${commentIdDelete}`, {
                method: "DELETE",
            });
            console.log('res from func', res)

            const data = await res.json();
            console.log('data from func', data)

            if (!res.ok) {
                toast.error("You can't delete the user toast", data.message);
            } else {
                setCommentsList((prev) => prev.filter((user) => user._id !== commentIdDelete));
                setShowModal(false);
                toast.success("The post has been deleted");
            };
        } catch (error) {
            console.log(error.message);
            toast.error("You can't delete the user");
        }
    }

    return (
        <div className='w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && commentsList.length > 0 ? (
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

                        {commentsList.map((commentItem) => (
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