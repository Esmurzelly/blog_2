import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom';
import { checkIsAuth } from '../redux/user/userSlice';

const ProtectedRoute = ({ adminOny = false }) => {
    const { currentUser } = useSelector(state => state.user);
    const isAuth = useSelector(checkIsAuth);

    if(!isAuth) return <Navigate to={'/sign-in'} />;
    
    if(adminOny && !currentUser?.isAdmin) return <Navigate to={'/sign-in'} />;

    return <Outlet />
}

export default ProtectedRoute;