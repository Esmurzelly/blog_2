import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom';
import { checkIsAuth } from '../redux/user/userSlice';

const AdminPrivateRoute = () => {
  const { currentUser } = useSelector(state => state.user);
  const isAuth = useSelector(checkIsAuth);
  
  return isAuth && currentUser.isAdmin ? <Outlet /> : <Navigate to={'/sign-in'} />
}

export default AdminPrivateRoute