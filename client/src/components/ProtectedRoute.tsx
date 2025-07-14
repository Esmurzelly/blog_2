import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { checkIsAuth } from '../redux/user/userSlice';

const ProtectedRoute = ({ adminOny = false }: { adminOny?: boolean }) => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const isAuth = useSelector(checkIsAuth);

    if(!isAuth) return <Navigate to={'/sign-in'} />;
    
    if(adminOny && !currentUser?.isAdmin) return <Navigate to={'/sign-in'} />;

    return <Outlet />
}

export default ProtectedRoute;