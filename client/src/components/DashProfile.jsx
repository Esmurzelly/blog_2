import { Button, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateStart, updateSuccess, updateFailure, deleteUserFailure, deleteUserSuccess, signOutSuccess, updateUser, updateUserPhoto, deleteUser } from '../redux/user/userSlice';
import defaultAvatar from '../assets/user.png'
import { toast } from 'react-toastify';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Loader from './Loader';

const DashProfile = () => {
    const { currentUser, loading } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const filePickerRef = useRef();
    const dispatch = useDispatch();

    const profilePicture = imageFile
        ? URL.createObjectURL(imageFile)
        : currentUser.profilePicture
            ? currentUser?.profilePicture.startsWith('https') ? currentUser?.profilePicture
                : `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/userAvatar/${currentUser.profilePicture}`
            : defaultAvatar;


    const handleChangeImage = e => {
        const file = e.target.files[0];
        if (file && file.type.includes('image')) {
            setImageFile(file);
        }
    };

    const handleChange = e => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (Object.keys(formData).length === 0) return;

        try {
            // dispatch(updateStart());
            // const res = await fetch(`/api/user/update/${currentUser._id}`, {
            //     method: "PUT",
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });

            // const data = await res.json();

            // if (!res.ok) {
            //     dispatch(updateFailure(data.message));
            //     toast.error(data.message);
            //     return;
            // } else {
            //     dispatch(updateSuccess(data));
            //     toast.success("You have updated your data successfuly");
            // }

            const response = await dispatch(updateUser({ formData, currentUserId: currentUser._id }));

            if (response.payload.success === false) {
                toast.error(response.payload.message);
                return;
            }

            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('file', imageFile);

                const response = await dispatch(updateUserPhoto({ imageFormData }));

                if (response.payload.success === false) {
                    toast.error(response.payload.message);
                    return;
                }

                // const imageRes = await fetch(`/api/user/avatar`, {
                //     method: "POST",
                //     body: imageFormData
                // });

                // const imageData = await imageRes.json();

                // if (!imageRes.ok) {
                //     dispatch(updateFailure(imageData.message));
                //     toast.error(data.message);
                //     return;
                // }

                // dispatch(updateSuccess(imageData));
                // toast.success("You have updated your data successfuly");
                setImageFile(null);
            }
            
            toast.success('You have updated your data successfuly')
        } catch (error) {
            // dispatch(updateFailure(error.message))
            toast.error(error.message);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);

        try {
            const response = await dispatch(deleteUser({ currentUserId: currentUser._id }));

            console.log('response from deleteUser', response)

            if (response.payload.success === false) {
                toast.error(response.payload.message);
                return;
            }


            // const res = await fetch(`/api/user/delete/${currentUser._id}`, {
            //     method: "DELETE"
            // });

            // const data = await res.json();

            // if (!res.ok) {
            //     dispatch(deleteUserFailure(data.message));
            // } else {
            //     dispatch(deleteUserSuccess(data));
            //     toast.success("You have deleted your account successfuly");
            // }

            toast.success("You have deleted your account successfuly");
        } catch (error) {
            // dispatch(deleteUserFailure(error.message))
            toast.error(error.message);
        }
    };

    const handleSignout = async () => {
        try {
            const res = await fetch('api/user/signout', {
                method: "POST"
            });

            const data = res.json();

            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signOutSuccess());
                toast.success("You was signed out successfuly");
            }
        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
        }
    }

    if (loading) return <Loader />

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type="file" accept='image/*' hidden onChange={handleChangeImage} ref={filePickerRef} />
                <div
                    className="w-32 h-32 self-center cursor-pointer shadow-md rounded-full overflow-hidden"
                    onClick={() => filePickerRef.current.click()}
                >
                    <img
                        src={profilePicture}
                        alt="profile_picture"
                        className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'
                    />
                </div>

                <TextInput onChange={handleChange} className='w-full' type='text' id='username' placeholder='username' defaultValue={currentUser.username} autoComplete='username' />
                <TextInput onChange={handleChange} className='w-full' type='email' id='email' placeholder='email' defaultValue={currentUser.email} autoComplete='email' />
                <TextInput onChange={handleChange} className='w-full' type='password' id='password' placeholder='password' autoComplete='current-password' />

                <Button disabled={loading} type='submit' className='bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer'>
                    {loading ? "Loading..." : "Update"}
                </Button>

                {currentUser.isAdmin && <Link to={'/create-post'}>
                    <Button
                        type='button'
                        className='w-full bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer'
                    >
                        Create post
                    </Button></Link>}

            </form>

            <div className="text-red-500 flex justify-between items-center mt-5">
                <div onClick={() => setShowModal(true)} className="cursor-pointer">Delete account</div>
                <div onClick={handleSignout} className="cursor-pointer">Sign Out</div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500! dark:text-gray-400'>Are you sure you want to delete your account?</h3>

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

export default DashProfile