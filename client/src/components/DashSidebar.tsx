import React, { useEffect, useState } from 'react'
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation } from 'react-icons/hi'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { signOutSuccess, signOutUser } from '../redux/user/userSlice';
import { toast } from 'react-toastify';
import { RootState, useAppDispatch } from '../redux/store';

const DashSidebar = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            await dispatch(signOutUser()).unwrap();
            dispatch(signOutSuccess());

            toast.success("You have signed out successfuly");
            navigate('/sign-in')
        } catch (error: any) {
            console.log(error.message)
            toast.error(error.message || 'Something went wrong')
        }
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');

        if (tabFromUrl) setTab(tabFromUrl);
    }, [location.search]);

    return (
        <Sidebar className='w-full md:w-56 mt-1 shadow-2xl'>
            <SidebarItems>
                <SidebarItemGroup className='flex flex-col gap-1'>
                    <Link to={'/dashboard?tab=profile'}>
                        <SidebarItem active={tab === 'profile'} icon={HiUser} label={currentUser?.isAdmin ? "Admin" : "User"} labelColor='red' as={'div'}>Profile</SidebarItem>
                    </Link>
                    {currentUser?.isAdmin && (
                        <>
                            <Link to={'/dashboard?tab=posts'}>
                                <SidebarItem active={tab === 'posts'} icon={HiDocumentText} as={'div'}>Posts</SidebarItem>
                            </Link>

                            <Link to={'/dashboard?tab=users'}>
                                <SidebarItem active={tab === 'users'} icon={HiOutlineUserGroup} as={'div'}>Users</SidebarItem>
                            </Link>

                            <Link to={'/dashboard?tab=comments'}>
                                <SidebarItem active={tab === 'comments'} icon={HiAnnotation} as={'div'}>Comments</SidebarItem>
                            </Link>

                            <Link to={'/dashboard?tab=dash'}>
                                <SidebarItem active={tab === 'dash'} icon={HiAnnotation} as={'div'}>Dashboard</SidebarItem>
                            </Link>
                        </>
                    )}
                    <SidebarItem onClick={handleSignout} icon={HiArrowSmRight} className='cursor-pointer'>Sign Out</SidebarItem>
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
    )
}

export default DashSidebar