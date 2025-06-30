import { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import defaultAvatar from '../assets/user.png'
import { signOutSuccess, signOutUser } from '../redux/user/userSlice'
import { toast } from 'react-toastify'

const Header = () => {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const profilePicture = currentUser?.profilePicture
    ? `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/userAvatar/${currentUser.profilePicture}`
    : defaultAvatar;

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');

    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

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
      toast.error(error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  return (
    <Navbar>
      <Link to={'/'} className='text-sm sm:text-xl font-semibold'>
        <span className='px-2 text-black py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg'>Sahand's</span>
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
        <Button className='w-12 h-10' color='gray' pill>
          <AiOutlineSearch />
        </Button>
      </Link>



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