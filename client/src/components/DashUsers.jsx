import { Button, Modal, ModalBody, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import React, { useState, useEffect } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from "react-icons/fa";

const DashUsers = () => {
    const { currentUser } = useSelector(state => state.user);
    const [usersList, setUsersList] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdDelete, setUserIdDelete] = useState('');

    const handleShowMore = async () => {
        const startIndex = usersList.length;

        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            const data = await res.json()

            if (res.ok) {
                setUsersList((prev) => [...prev, ...data.users]);

                if (data.users.length < 9) setShowMore(false);
            }
        } catch (error) {
            console.log(error.message);
            toast.error("You can't get more posts");
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`);
                const data = await res.json();

                if (res.ok) {
                    setUsersList(data.users);
                    toast.success("You got the posts successfuly");

                    if (data.users.length < 9) setShowMore(false);
                }
            } catch (error) {
                console.log(error.message);
                toast.error("You can't get the users list");
            }
        };

        if (currentUser.isAdmin) fetchUsers();
    }, [currentUser]);

    const handleDeletePost = async () => {
        try {
            const res = await fetch(`/api/user/delete/${userIdDelete}`, {
                method: "DELETE",
            });
            console.log('res from func', res)

            const data = await res.json();
            console.log('data from func', data)

            if (!res.ok) {
                toast.error("You can't delete the user toast", data.message);
            } else {
                setUsersList((prev) => prev.filter((user) => user._id !== userIdDelete));
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
            {currentUser.isAdmin && usersList.length > 0 ? (
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

                        {usersList.map((user) => (
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

                    {showMore && (
                        <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
                            Show More
                        </button>
                    )}
                </>
            ) : (
                <p>You don't have users</p>
            )}

            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500! dark:text-gray-400'>Are you sure you want to delete the user?</h3>

                        <div className="flex justify-between items-center gap-4">
                            <Button className='text-xl text-red-500' color={'failure'} onClick={handleDeletePost}>
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