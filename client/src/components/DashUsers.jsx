import React, { useState, useEffect } from 'react'
import { Button, Modal, ModalBody, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from "react-icons/fa";
import Loader from './Loader';
import { getUsers, deleteUser } from '../redux/user/userSlice';
import { FaAnglesLeft, FaAnglesRight, FaAngleRight, FaAngleLeft } from 'react-icons/fa6';

const DashUsers = () => {
    const { currentUser, users, totalUsers } = useSelector(state => state.user);
    const [showMore, setShowMore] = useState(true);
    const [showLess, setShowLess] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userIdDelete, setUserIdDelete] = useState('');
    const dispatch = useDispatch();
    const [startIndex, setStartIndex] = useState(0);

    const [pageNumber, setPageNumber] = useState(1);
    const USERS_PER_PAGE = 9;

    const fetchUsersByPage = async (page) => {
        const newStartIndex = (page - 1) * USERS_PER_PAGE;

        try {
            const response = await dispatch(getUsers({ startIndex: newStartIndex, limit: USERS_PER_PAGE })).unwrap();
            const newUsers = response.users || [];

            setStartIndex(newStartIndex);
            setPageNumber(page);
            setShowMore(page < Math.ceil(totalUsers / USERS_PER_PAGE));
            setShowLess(page > 1);
        } catch (error) {
            console.log(error.message);
            toast.error("Unable to load users");
        }
    };

    const handleShowMore = () => {
        fetchUsersByPage(pageNumber + 1);
    };

    const handleShowBack = () => {
        fetchUsersByPage(pageNumber - 1);
    };

    const handleGoToStart = () => {
        fetchUsersByPage(1);
    };

    const handleGoToEnd = () => {
        fetchUsersByPage(Math.ceil(totalUsers / USERS_PER_PAGE));
    };


    useEffect(() => {
        if (currentUser.isAdmin) fetchUsersByPage(1);
    }, [currentUser]);

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUser({ currentUserId: userIdDelete }));

            setShowModal(false);
            toast.success("The user has been deleted");
        } catch (error) {
            console.log(error.message);
            toast.error("You can't delete the user");
        }
    }

    if (!users) return <Loader />

    return (
        <div className='w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md border'>
                        <TableHead>
                            <TableHeadCell>Date created</TableHeadCell>
                            <TableHeadCell>User image</TableHeadCell>
                            <TableHeadCell>Username</TableHeadCell>
                            <TableHeadCell>Email</TableHeadCell>
                            <TableHeadCell>Admin</TableHeadCell>
                            <TableHeadCell>Delete</TableHeadCell>
                        </TableHead>

                        {users.map((user) => (
                            <TableBody className='divide-y' key={user._id}>
                                <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>

                                    <TableCell>
                                        <img className='w-10 h-10 object-cover bg-gray-500 rounded-full' src={user.profilePicture.startsWith('http')
                                            ? user.profilePicture
                                            : `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/userAvatar/${user.profilePicture}`} alt={user.username} />
                                    </TableCell>

                                    <TableCell>
                                        <p className='font-medium text-gray-900 dark:text-white'>{user.username}</p>
                                    </TableCell>

                                    <TableCell>
                                        <p className='font-medium text-gray-900 dark:text-white'>{user.email}</p>
                                    </TableCell>

                                    <TableCell>{user.isAdmin ? <FaCheck className='text-green-600' /> : <FaTimes className='text-red-600' />}</TableCell>

                                    <TableCell>
                                        <span onClick={() => {
                                            setShowModal(true);
                                            setUserIdDelete(user._id)
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

                        {[...Array(Math.ceil(totalUsers / USERS_PER_PAGE)).keys()].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => fetchUsersByPage(i + 1)}
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
                        <h3 className='mb-5 text-lg text-gray-500! dark:text-gray-400'>Are you sure you want to delete the user?</h3>

                        <div className="flex justify-between items-center gap-4">
                            <Button className='text-xl text-red-500' color={'failure'} onClick={handleDeleteUser}>
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

export default DashUsers