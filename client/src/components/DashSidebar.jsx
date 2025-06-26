import React, { useEffect, useState } from 'react'
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation } from 'react-icons/hi'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOutSuccess, signOutUser } from '../redux/user/userSlice';
import { toast } from 'react-toastify';

const DashSidebar = () => {
    const { currentUser } = useSelector(state => state.user);
    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            const response = await dispatch(signOutUser());
            dispatch(signOutSuccess());

            if (response.payload.success === false) {
                toast.error(response.payload.message);
                return;
            }

            toast.success("You have signed out successfuly");
            navigate('/sign-in')
        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');

        if (tabFromUrl) setTab(tabFromUrl);
    }, [location.search]);

    return (
        <Sidebar className='w-full md:w-56'>
            <SidebarItems>
                <SidebarItemGroup className='flex flex-col gap-1'>
                    <Link to={'/dashboard?tab=profile'}>
                        <SidebarItem active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? "Admin" : "User"} labelColor='red' as={'div'}>Profile</SidebarItem>
                    </Link>
                    {currentUser.isAdmin && (
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