import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom';
import { checkIsAuth } from '../redux/user/userSlice';
import { RootState } from '../redux/store';

const ProtectedRoute = ({ adminOny = false }: { adminOny?: boolean }) => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const isAuth = useSelector(checkIsAuth);

    if(!isAuth) return <Navigate to={'/sign-in'} />;
    
    if(adminOny && !currentUser?.isAdmin) return <Navigate to={'/sign-in'} />;

    return <Outlet />
}

export default ProtectedRoute;