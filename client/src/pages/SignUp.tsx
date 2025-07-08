import React, { useEffect, useState } from 'react'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';
import { checkIsAuth, registerUser } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState, useAppDispatch } from '../redux/store';

interface IForm {
  username: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const [formData, setFormData] = useState<IForm>({
    username: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, loading } = useSelector((state: RootState) => state.user);
  const isAuth = useSelector(checkIsAuth);

  useEffect(() => {
    if (status) toast(status);
    if (isAuth) navigate('/')
  }, [status, isAuth, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setErrorMessage(null);
      dispatch(registerUser(formData));
      navigate('/');
    } catch (error: any) {
      console.log(error);
      toast(error)
    }
  }

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

          <p className='text-sm mt-5'>This is a demo project. You can sign up with your email and password or with Google.</p>
        </div>

        <div className="flex-1">
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label className="text-black" htmlFor="username">
                <p className='mb-2'>Your username</p>
              </Label>
              <TextInput onChange={handleChange} id='username' type='text' placeholder='adam' />
            </div>

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
              ) : "Sign Up"}
            </Button>

            <OAuth />
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span> {""}
            <Link to={'/sign-in'} className='text-blue-500 cursor-pointer'>Sign In</Link>
          </div>
        </div>

        {
          errorMessage && (
            <Alert className='mt-5' color='failure'>{errorMessage}</Alert>
          )
        }
      </div>
    </div>
  )
}

export default SignUp