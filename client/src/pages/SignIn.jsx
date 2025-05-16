import React, { useState } from 'react'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch('/api/auth/signin', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false)
        return setErrorMessage(data.message);
      }

      setLoading(false);

      if(res.ok) navigate('/')

    } catch (error) {
      setErrorMessage(error);
      setLoading(false);
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

          <p className='text-sm mt-5'>This is a demo project. You can sign in with your email and password or with Google.</p>
        </div>

        <div className="flex-1">
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label className="text-black" htmlFor="email">
                <p>Your email</p>
              </Label>
              <TextInput onChange={handleChange} id='email' type='email' placeholder='adam@gmail.com' />
            </div>

            <div>
              <Label className="text-black" htmlFor="password">
                <p>Your password</p>
              </Label>
              <TextInput onChange={handleChange} id='password' type='password' placeholder='******' />
            </div>

            <Button disabled={loading} type='submit' className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
              {loading ? (
                <>
                  <Spinner size='sm' color="info" aria-label="Info spinner example" />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : "Sign In"}
            </Button>
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span> {""}
            <Link to={'/sign-up'} className='text-blue-500'>Sign Up</Link>
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

export default SignIn