import React, { useCallback, useEffect, useState } from 'react'
import { Button, Label, Spinner, TextInput } from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import { signInUser } from '../redux/user/userSlice'
import { useSelector } from 'react-redux'
import OAuth from '../components/OAuth'
import Loader from '../components/Loader'
import { toast } from 'react-toastify'
import { RootState, useAppDispatch } from '../redux/store'

interface IForm {
  email: string;
  password: string;
}

const SignIn = () => {
  const [formData, setFormData] = useState<IForm>({
    email: '',
    password: '',
  });
  const { loading, currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value.trim() });
  };

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Sing in failed. Please fill all fields.");
      return;
    }

    try {
      await dispatch(signInUser(formData)).unwrap();
      navigate('/');
    } catch (error: any) {
      console.log(error);
      toast.error('Wrong data')
      return;
    }
  }, [formData, dispatch, navigate])

  if (loading) return <Loader />

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link
            to={'/'}
            className='text-4xl font-bold dark:text-white'
          >
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg dark:text-white'>Sahand's</span>
            <span>Blog</span>
          </Link>

          <p className='text-sm mt-5'>This is a demo project. You can sign in with your email and password or with Google.</p>
        </div>

        <div className="flex-1">
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label className="text-black" htmlFor="email">
                <p className='mb-2'>Your email</p>
              </Label>
              <TextInput autoComplete='email' required onChange={handleChange} id='email' type='email' placeholder='adam@gmail.com' />
            </div>

            <div>
              <Label className="text-black" htmlFor="password">
                <p className='mb-2'>Your password</p>
              </Label>
              <TextInput onChange={handleChange} id='password' type='password' placeholder='******' />
            </div>

            <Button disabled={loading} type='submit' className='cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
              {loading ? (
                <>
                  <Spinner size='sm' color="info" aria-label="Info spinner example" />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : "Sign In"}
            </Button>

            <OAuth />
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span> {""}
            <Link to={'/sign-up'} className='text-blue-500 cursor-pointer'>Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn