import React from 'react'
import { Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarCollapse, NavbarLink, NavbarToggle, TextInput } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import defaultAvatar from '../assets/user.png'
import { signOutSuccess } from '../redux/user/userSlice'
import { toast } from 'react-toastify'

const Header = () => {
  const path = useLocation().pathname;
  const { currentUser } = useSelector(state => state.user);
  const { theme } = useSelector(state => state.theme);
  const dispatch = useDispatch();

  const profilePicture = currentUser?.profilePicture
    ? `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/userAvatar/${currentUser.profilePicture}`
    : defaultAvatar;

  const handleSignout = async () => {
    try {
      const res = await fetch('api/user/signout', {
        method: "POST"
      });

      console.log('res header', res);

      const data = await res.json();
      console.log('data header', data);

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

  return (
    <Navbar className='border-b-2'>
      <Link to={'/'} className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 text-black py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg dark:text-white'>Sahand's</span>
        Blog
      </Link>

      <form>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
        />
      </form>

      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>

      <div className='flex gap-2 md:order-2'>
        <Button onClick={() => dispatch(toggleTheme())} className='w-12 h-10 hidden sm:inline' color={'gray'} pill>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </Button>

        {currentUser ? (
          <Dropdown arrowIcon={false} inline label={<Avatar img={profilePicture} rounded className='cursor-pointer' alt='user' />}>
            <DropdownHeader>
              <span className="block text-white! text-sm">@{currentUser.username}</span>
              <span className="block text-white! text-sm font-medium truncate">{currentUser.email}</span>
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
        <NavbarLink as={'div'} active={path === '/projects'}>
          <Link to={'/projects'}>Projects</Link>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  )
}

export default Header