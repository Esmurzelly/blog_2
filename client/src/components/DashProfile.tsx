import { Button, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import React, { useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { signOutSuccess, updateUser, updateUserPhoto, deleteUser, signOutUser } from '../redux/user/userSlice';
import defaultAvatar from '../assets/user.png'
import { toast } from 'react-toastify';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import Loader from './Loader';
import { RootState, useAppDispatch } from '../redux/store';

interface IFomData {
    username: string | undefined;
    email: string | undefined;
    password: string | undefined;
}

const DashProfile = () => {
    const { currentUser, loading } = useSelector((state: RootState) => state.user);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<IFomData>({
        username: currentUser?.username || '',
        email: currentUser?.email || '',
        password: '',
    });
    const [showModal, setShowModal] = useState<boolean>(false);
    const filePickerRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const profilePicture = imageFile
        ? URL.createObjectURL(imageFile)
        : currentUser && currentUser.profilePicture
            ? currentUser?.profilePicture.startsWith('https') ? currentUser?.profilePicture
                //@ts-ignore
                : `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/userAvatar/${currentUser.profilePicture}`
            : defaultAvatar;


    const handleChangeImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file && file.type.includes('image')) {
            setImageFile(file);
        }
    }, [imageFile])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData({ ...formData, [id]: value })
    };

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!currentUser) {
            toast.error("No user found");
            return;
        }

        try {
            await dispatch(updateUser({ formData, currentUserId: currentUser._id })).unwrap();

            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('file', imageFile);

                await dispatch(updateUserPhoto({ imageFormData })).unwrap();
                setImageFile(null);
            }

            toast.success('You have updated your data successfuly')
        } catch (error: any) {
            toast.error(error?.message || 'Something went wrong');
        }
    }, [dispatch, imageFile, formData, currentUser]);

    const handleDeleteUser = async () => {
        setShowModal(false);

        try {
            if (!currentUser) {
                toast.error("No user found");
                return;
            }

            await dispatch(deleteUser({ currentUserId: currentUser._id })).unwrap();
            toast.success("You have deleted your account successfuly");
        } catch (error: any) {
            toast.error(error?.message || 'Something went wrong');
        }
    };

    const handleSignout = async () => {
        try {
            await dispatch(signOutUser()).unwrap();
            dispatch(signOutSuccess());

            toast.success("You have signed out successfuly");
            navigate('/sign-in')
        } catch (error: any) {
            console.log(error.message);
            toast.error(error?.message || 'Something went wrong');
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
                    onClick={() => filePickerRef.current?.click()}
                >
                    <img
                        src={profilePicture}
                        alt="profile_picture"
                        className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'
                    />
                </div>

                <TextInput onChange={handleChange} className='w-full' type='text' id='username' placeholder='username' defaultValue={currentUser?.username} autoComplete='username' />
                <TextInput onChange={handleChange} className='w-full' type='email' id='email' placeholder='email' defaultValue={currentUser?.email} autoComplete='email' />
                <TextInput onChange={handleChange} className='w-full' type='password' id='password' placeholder='password' autoComplete='current-password' />

                <Button disabled={loading} type='submit' className='bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer'>
                    {loading ? "Loading..." : "Update"}
                </Button>

                {currentUser && currentUser.isAdmin && <Link to={'/create-post'}>
                    <Button
                        type='button'
                        className='w-full bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer'
                    >
                        Create post
                    </Button></Link>}

            </form>

            <div className="text-red-500 flex justify-between items-center mt-5">
                <button onClick={() => setShowModal(true)} className="cursor-pointer">Delete account</button>
                <button onClick={handleSignout} className="cursor-pointer">Sign Out</button>
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