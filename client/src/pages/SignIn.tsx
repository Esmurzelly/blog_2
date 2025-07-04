import React, { useEffect, useState } from 'react'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import { signInUser } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import OAuth from '../components/OAuth'
import Loader from '../components/Loader'
import { toast } from 'react-toastify'

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, status } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Sing in failed. Please fill all fields.");
    }

    try {
      const response = await dispatch(signInUser(formData));

      if (response.payload.success === false) {
        toast.error(response.payload.message);
        return;
      }

      navigate('/');
    } catch (error) {
      console.log(error)
    }
  }

  if(loading) return <Loader />

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
              <TextInput onChange={handleChange} id='email' type='email' placeholder='adam@gmail.com' />
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