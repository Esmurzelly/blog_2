import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom';
import { checkIsAuth } from '../redux/user/userSlice';

const PrivateRoute = () => {
  const isAuth = useSelector(checkIsAuth);
  
  return isAuth ? <Outlet /> : <Navigate to={'/sign-in'} />
}

export default PrivateRoute