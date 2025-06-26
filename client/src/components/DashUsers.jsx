import React, { useState, useEffect } from 'react'
import { Button, Modal, ModalBody, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from "react-icons/fa";
import Loader from './Loader';
import { getUsers, deleteUser } from '../redux/user/userSlice';

const DashUsers = () => {
    const { currentUser, users, totalUsers } = useSelector(state => state.user);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdDelete, setUserIdDelete] = useState('');
    const dispatch = useDispatch();
    const [startIndex, setStartIndex] = useState(9);

    const handleShowMore = async () => {
        if (startIndex > totalUsers) return;

        try {
            const response = await dispatch(getUsers({ startIndex, limit: 9 })).unwrap();

            const newUsers = response.users || [];
            setStartIndex(prev => prev + 9);

            if (startIndex + newUsers.length >= totalUsers) {
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
        const fetchUsers = async () => {
            try {
                const response = await dispatch(getUsers({ startIndex: 0, limit: 9 })).unwrap();

                toast.success("You got the users successfuly");
                if (response.users.length < 9) setShowMore(false);
            } catch (error) {
                console.log(error.message);
                toast.error("You can't get the users list");
            }
        };

        if (currentUser.isAdmin) fetchUsers();
    }, [currentUser]);

    const handleDeleteUser = async () => {
        try {
            const response = await dispatch(deleteUser({ currentUserId: userIdDelete }));

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