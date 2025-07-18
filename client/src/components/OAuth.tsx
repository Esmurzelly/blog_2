import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/store';
import { signInGoogle } from '../redux/user/userSlice';
import { Button } from 'flowbite-react'
import { app } from '../firebase'
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { toast } from 'react-toastify';
import { AiFillGoogleCircle } from 'react-icons/ai'

interface ResultsFromGoogleObj {
    name: string;
    email: string;
    googlePhotoUrl: string;
}

const OAuth = () => {
    const auth = getAuth(app);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);

            const resultsFromGoogleObj: ResultsFromGoogleObj = {
                name: resultsFromGoogle.user.displayName ?? '',
                email: resultsFromGoogle.user.email ?? '',
                googlePhotoUrl: resultsFromGoogle.user.photoURL ?? '',
            }

            await dispatch(signInGoogle(resultsFromGoogleObj)).unwrap();
            toast.success('You signed in successfuly')
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Button
            className='cursor-pointer bg-gradient-to-r from-pink-500 to-orange-500 text-white!'
            type='button'
            outline
            onClick={handleGoogleClick}
        >
            <AiFillGoogleCircle className='w-6 h-6 mr-2' />
            Continue with Google
        </Button>
    )
}

export default OAuth