import React, { useEffect, useState } from 'react'
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { HiUser, HiArrowSmRight } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';
import { toast } from 'react-toastify';

const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();

    const handleSignout = async () => {
        try {
            const res = await fetch('api/user/signout', {
                method: "POST"
            });

            const data = res.json();

            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signOutSuccess());
                toast.success("You was signed out successfuly");
            }
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
                <SidebarItemGroup >
                    <Link to={'/dashboard?tab=profile'}>
                        <SidebarItem active={tab === 'profile'} icon={HiUser} label='User' labelColor='red' as={'div'}>Profile</SidebarItem>
                    </Link>
                    <SidebarItem onClick={handleSignout} icon={HiArrowSmRight} className='cursor-pointer'>Sign Out</SidebarItem>
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
    )
}

export default DashSidebar