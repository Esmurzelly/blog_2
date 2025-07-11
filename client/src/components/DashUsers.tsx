import React, { useState, useEffect, useCallback } from 'react'
import { Button, Modal, ModalBody, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from "react-icons/fa";
import Loader from './Loader';
import { getUsers, deleteUser } from '../redux/user/userSlice';
import Pagination from './Pagination';
import { RootState, useAppDispatch } from '../redux/store';

const DashUsers = () => {
    const { currentUser, users, totalUsers } = useSelector((state: RootState) => state.user);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [userIdDelete, setUserIdDelete] = useState<string>('');
    const dispatch = useAppDispatch();

    const [pageNumber, setPageNumber] = useState<number>(1);
    const USERS_PER_PAGE: number = 9;

    const fetchUsersByPage = useCallback(async (page: number) => {
        const newStartIndex = (page - 1) * USERS_PER_PAGE;

        try {
            await dispatch(getUsers({ startIndex: newStartIndex, limit: USERS_PER_PAGE })).unwrap();
            setPageNumber(page);
        } catch (error: any) {
            console.log(error.message);
            toast.error("Unable to load users");
        }
    }, [dispatch])

    const handleShowMore = useCallback(() => {
        fetchUsersByPage(pageNumber + 1);
    }, [fetchUsersByPage, pageNumber])

    const handleShowBack = useCallback(() => {
        fetchUsersByPage(pageNumber - 1);
    }, [fetchUsersByPage, pageNumber])

    const handleGoToStart = useCallback(() => {
        fetchUsersByPage(1);
    }, [fetchUsersByPage])

    const handleGoToEnd = useCallback(() => {
        fetchUsersByPage(Math.ceil(totalUsers / USERS_PER_PAGE));
    }, [fetchUsersByPage, totalUsers])


    useEffect(() => {
        if (currentUser?.isAdmin) fetchUsersByPage(1);
    }, [currentUser?.isAdmin, fetchUsersByPage]);

    const handleDeleteUser = async () => {
        try {
            if (userIdDelete === currentUser?._id) {
                toast.error("You cannot delete your own account.");
                return;
            }

            await dispatch(deleteUser({ currentUserId: userIdDelete })).unwrap();
            setShowModal(false);
            toast.success("The user has been deleted");
        } catch (error: any) {
            console.log(error.message);
            toast.error("You can't delete the user");
        }
    }

    if (!users || !currentUser) return <Loader />

    return (
        <div className='w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300'>
            {currentUser && currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Date created</TableHeadCell>
                                <TableHeadCell>User image</TableHeadCell>
                                <TableHeadCell>Username</TableHeadCell>
                                <TableHeadCell>Email</TableHeadCell>
                                <TableHeadCell>Admin</TableHeadCell>
                                <TableHeadCell>Delete</TableHeadCell>
                            </TableRow>
                        </TableHead>

                        <TableBody className='divide-y'>
                            {users.map((user) => (
                                <TableRow key={user._id} className='bg-white dark:bg-gray-700'>
                                    <TableCell>
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                    </TableCell>

                                    <TableCell>
                                        <img className='w-10 h-10 object-cover bg-gray-500 rounded-full' src={user.profilePicture?.startsWith('http')
                                            ? user.profilePicture
                                            // @ts-ignore
                                            : `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/userAvatar/${user.profilePicture}`} alt={user.username} />
                                    </TableCell>

                                    <TableCell>
                                        <p className='font-medium text-gray-900 dark:text-gray-300'>{user.username}</p>
                                    </TableCell>

                                    <TableCell>
                                        <p className='font-medium text-gray-900 dark:text-gray-300'>{user.email}</p>
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
                            ))}
                        </TableBody>
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
                <p className='text-center text-gray-500 mt-4'>No users found</p>
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