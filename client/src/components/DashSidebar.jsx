import React, { useEffect, useState } from 'react'
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { HiUser, HiArrowSmRight } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';

const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState('');

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
                    <SidebarItem icon={HiArrowSmRight} className='cursor-pointer'>Sign Out</SidebarItem>
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
    )
}

export default DashSidebar