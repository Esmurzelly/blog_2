import React, { useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux/store';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { checkIsAuth, registerUser } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';
import { RxUpdate } from "react-icons/rx";
import { useForm, SubmitHandler } from 'react-hook-form';

interface IForm {
  username: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<IForm>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, loading } = useSelector((state: RootState) => state.user);
  const isAuth = useSelector(checkIsAuth);

  useEffect(() => {
    if (status) toast(status);
    if (isAuth) navigate('/')
  }, [status, isAuth, navigate]);

  const generateUserName = () => {
    const names = ["Dehan", "Musfiq", "Rahim", "Sohel", "MOhit", "Adam", "Wilda", "Jayson", "Grace", "Stella",
      "Molly", "Fredrick", "Barrett", "Marcos", "Isaac"];
    const randInt = Math.floor(Math.random() * names.length);
    const randStr = Math.floor(Math.random() * 10000);
    setValue('username', names[randInt]);
    setValue('email', `${names[randInt].toLowerCase()}${randStr}@gmail.com`)
  }

  const onSubmit: SubmitHandler<IForm> = useCallback(async (data) => {
    if (!data.username || !data.email || !data.password) {
      return toast.error('Please fill out all fields.');
    };

    try {
      await dispatch(registerUser(data));
      navigate('/');
    } catch (error: any) {
      console.log(error);
      toast(error)
    }
  }, [dispatch, navigate]);

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
          <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label className="text-black" htmlFor="username">
                <p className='mb-2'>Your username</p>
              </Label>

              <div className="flex items-center w-full relative">
                <TextInput {...register("username", { required: true, minLength: 4, maxLength: 30 })} className='flex-1' id='username' type='text' placeholder='adam' />
                <RxUpdate className='w-10 h-10 p-1 absolute right-0 bg-teal-500 rounded-xs cursor-pointer' onClick={generateUserName} />
              </div>
              {errors.username?.type === 'required' && <p role='alert'>This field is required</p>}
              {errors.username?.type === 'minLength' && <p role='alert'>Enter more than 4 symbols</p>}
              {errors.username?.type === 'maxLength' && <p role='alert'>Enter less than 30 symbols</p>}
            </div>

            <div>
              <Label className="text-black" htmlFor="email">
                <p className='mb-2'>Your email</p>
              </Label>
              <TextInput {...register("email", { required: true, minLength: 8, maxLength: 30 })} id='email' type='email' placeholder='adam@gmail.com' />
              {errors.email?.type === 'email' && <p role='alert'>This field is required</p>}
              {errors.email?.type === 'minLength' && <p role='alert'>Enter more than 8 symbols</p>}
              {errors.email?.type === 'maxLength' && <p role='alert'>Enter less than 30 symbols</p>}
            </div>

            <div>
              <Label className="text-black" htmlFor="password">
                <p className='mb-2'>Your password</p>
              </Label>
              <TextInput {...register("password", { required: true, minLength: 5, maxLength: 30, pattern: /^[a-zA-Z0-9]+$/ })} id='password' type='password' placeholder='******' />
              {errors.password?.type === 'password' && <p role='alert'>This field is required</p>}
              {errors.password?.type === 'minLength' && <p role='alert'>Enter more than 5 symbols</p>}
              {errors.password?.type === 'maxLength' && <p role='alert'>Enter less than 30 symbols</p>}
              {errors.password?.type === 'pattern' && <p role='alert'>Password must contain only letters and numbers</p>}
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
      </div>
    </div>
  )
}

export default SignUp