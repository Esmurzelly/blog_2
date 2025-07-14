import React, { useCallback, useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarCollapse, NavbarLink, NavbarToggle, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import defaultAvatar from '../assets/user.png'
import { signOutSuccess, signOutUser } from '../redux/user/userSlice'
import { toast } from 'react-toastify'
import ChangeThemeButton from './ChangeThemeButton'
import { RootState, useAppDispatch } from '../redux/store'

const Header = () => {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return typeof window !== 'undefined' ? (localStorage.getItem("theme") as 'light' | 'dark') || "light" : "light";
  });

  const profilePicture = currentUser && currentUser.profilePicture
    ? currentUser?.profilePicture.startsWith('https') ? currentUser?.profilePicture
      //@ts-ignore
      : `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/userAvatar/${currentUser.profilePicture}`
    : defaultAvatar;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');

    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  const handleSignout = async () => {
    try {
      await dispatch(signOutUser()).unwrap();
      dispatch(signOutSuccess());

      toast.success("You have signed out successfuly");
      navigate('/sign-in')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }, [navigate, searchTerm, location.search])

  const handleSwitchTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Navbar className='outline dark:outline-gray-400'>
      <Link to={'/'} className='text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg'>Sahand's</span>
        Blog
      </Link>

      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden sm:inline'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </form>

      <Link to={'/search'} className='sm:hidden'>
        <Button className='w-12 h-10 rounded-sm' color='gray'>
          <AiOutlineSearch />
        </Button>
      </Link>

      <div className="md:order-1">
        <ChangeThemeButton onHandleSwitchTheme={handleSwitchTheme} theme={theme} />
      </div>


      <div className='flex gap-2 md:order-2'>
        {currentUser ? (
          <Dropdown arrowIcon={false} inline label={<Avatar img={profilePicture} rounded className='cursor-pointer' alt='user' />}>
            <DropdownHeader>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">{currentUser.email}</span>
            </DropdownHeader>

            <Link to={'/dashboard?tab=profile'}>
              <DropdownItem>Profile</DropdownItem>
            </Link>

            <DropdownDivider />

            <DropdownItem onClick={handleSignout}>Sign out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to={'/sign-in'}>
            <Button className='hover:bg-gradient-to-br hover:from-purple-600 hover:to-blue-500 cursor-pointer' outline> {/* gradientDuoTone='purpleToBlue' */}
              Sign In
            </Button>
          </Link>
        )}

        <NavbarToggle />
      </div>

      <NavbarCollapse>
        <NavbarLink as={'div'} active={path === '/'} >
          <Link to={'/'}>Home</Link>
        </NavbarLink>
        <NavbarLink as={'div'} active={path === '/about'}>
          <Link to={'/about'}>About</Link>
        </NavbarLink>
        <NavbarLink as={'div'} active={path === '/search'}>
          <Link to={'/search'}>Projects</Link>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  )
}

export default Header