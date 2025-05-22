import { Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

const DashProfile = () => {
    const { currentUser } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const filePickerRef = useRef();

    const handleChangeImage = e => {
        const file = e.target.files[0];
        setImageFile(file);

        const reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
        }

        reader.onload = (readerEvent) => {
            if (file.type.includes("image")) {
                setImageFile(readerEvent.target.result)
            }
        }
    };

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4'>
                <input type="file" accept='image/*' hidden onChange={handleChangeImage} ref={filePickerRef} />
                <div
                    className="w-32 h-32 self-center cursor-pointer shadow-md rounded-full overflow-hidden"
                    onClick={() => filePickerRef.current.click()}
                >
                    <img
                        src={imageFile || currentUser.profilePicture}
                        alt="profile_picture"
                        className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'
                    />
                </div>

                <TextInput className='w-full' type='text' id='username' placeholder='username' defaultValue={currentUser.username} autoComplete='username' />
                <TextInput className='w-full' type='email' id='email' placeholder='email' defaultValue={currentUser.email} autoComplete='email' />
                <TextInput className='w-full' type='password' id='password' placeholder='password' autoComplete='current-password' />

                <Button type='submit' className='bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer'>Update</Button>
            </form>

            <div className="text-red-500 flex justify-between items-center mt-5">
                <div className="cursor-pointer">Delete account</div>
                <div className="cursor-pointer">Sign Out</div>
            </div>
        </div>
    )
}

export default DashProfile