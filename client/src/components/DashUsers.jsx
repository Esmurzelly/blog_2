import React, { useState, useEffect } from 'react'
import { Button, Modal, ModalBody, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from "react-icons/fa";
import Loader from './Loader';
import { getUsers, deleteUser } from '../redux/user/userSlice';
import { FaAnglesLeft, FaAnglesRight, FaAngleRight, FaAngleLeft } from 'react-icons/fa6';
import Pagination from './Pagination';

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
        <div className='w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300'>
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
                                <TableRow className='bg-white'>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>

                                    <TableCell>
                                        <img className='w-10 h-10 object-cover bg-gray-500 rounded-full' src={user.profilePicture.startsWith('http')
                                            ? user.profilePicture
                                            : `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/userAvatar/${user.profilePicture}`} alt={user.username} />
                                    </TableCell>

                                    <TableCell>
                                        <p className='font-medium text-gray-900'>{user.username}</p>
                                    </TableCell>

                                    <TableCell>
                                        <p className='font-medium text-gray-900'>{user.email}</p>
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

                    <Pagination
                        pageNumber={pageNumber}
                        totalItem={totalUsers}
                        onFetchData={fetchUsersByPage}
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
                        <h3 className='mb-5 text-lg text-white'>Are you sure you want to delete the user?</h3>

                        <div className="flex justify-between items-center gap-4">
                            <Button className='text-xl text-red-500 cursor-pointer' color={'failure'} onClick={handleDeleteUser}>
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

export default DashUsers