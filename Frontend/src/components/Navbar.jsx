import React, {
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillHome, AiOutlineBell, AiOutlineSearch } from 'react-icons/ai';
import { RiMessage2Fill } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import { FaUserFriends } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import LinkedIn from '/linkedin.png';
import { UserDataContext } from '../context/UserContext';
import EmptyProfile from '/EmptyProfile.svg';
import axios from 'axios';
import { AuthDataContext } from '../context/AuthContext';

const NavItem = React.memo(({ to, icon: Icon, label, onClick }) => (
  <Link
    to={to}
    className="flex flex-col items-center gap-1 text-gray-700 hover:text-blue-600"
    onClick={onClick}
  >
    <Icon size={22} />
    <span className="text-[10px] sm:text-xs">{label}</span>
  </Link>
));

NavItem.displayName = 'NavItem';

const DropdownMenuItem = React.memo(({ children, onClick }) => (
  <li
    className="cursor-pointer rounded p-1 hover:bg-gray-100"
    onClick={onClick}
  >
    {children}
  </li>
));

DropdownMenuItem.displayName = 'DropdownMenuItem';

const Navbar = () => {
  const { userData, setUserData } = useContext(UserDataContext);
  const { serverUrl } = useContext(AuthDataContext);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Memoized logout handler
  const handleLogout = useCallback(async () => {
    try {
      await axios.post(
        `${serverUrl}/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUserData(null);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [serverUrl, setUserData, navigate]);

  // Memoized navigation handlers
  const handleViewProfile = useCallback(() => {
    navigate('/profile');
    setIsDropdownOpen(false);
  }, [navigate]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchActive((prev) => !prev);
  }, []);

  // Memoized user profile data
  const userProfileData = useMemo(
    () => ({
      name: `${userData?.firstname || ''} ${userData?.lastname || ''}`.trim(),
      headline: userData?.headline || '',
      profileImage: userData?.profileImage || EmptyProfile,
    }),
    [userData],
  );

  // Memoized navigation items configuration
  const navItems = useMemo(
    () => [
      { to: '/', icon: AiFillHome, label: 'Home' },
      { to: '/network', icon: FaUserFriends, label: 'Network' },
      { to: '/notification', icon: AiOutlineBell, label: 'Notifications' },
      { to: '/chatPage', icon: RiMessage2Fill, label: 'Message' },
    ],
    [],
  );

  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between gap-2 bg-white px-4 py-2 shadow-sm">
      <div className="relative flex flex-1 items-center gap-3">
        <img src={LinkedIn} alt="LinkedIn" className="h-8 w-8" />
        <form className="hidden flex-1 sm:flex">
          <input
            type="text"
            placeholder="Search"
            className="w-full max-w-sm rounded-md border bg-gray-100 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </form>
        <button
          className="ml-2 text-gray-700 sm:hidden"
          onClick={toggleSearch}
          aria-label="Search"
        >
          <AiOutlineSearch size={24} />
        </button>
      </div>

      {!isSearchActive && (
        <div className="flex items-center gap-6 pr-4 sm:gap-8">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
            />
          ))}

          <div
            className="relative flex cursor-pointer flex-col items-center"
            ref={dropdownRef}
          >
            <CgProfile
              size={26}
              onClick={toggleDropdown}
              aria-label="Profile menu"
            />
            <span className="text-[10px] sm:text-xs">Me</span>

            {isDropdownOpen && (
              <div className="absolute top-12 right-0 z-50 w-72 rounded-lg border bg-white p-4 shadow-lg">
                <div className="flex flex-col items-center justify-around gap-3 border-b pb-3">
                  <img
                    src={userProfileData.profileImage}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <div className="text-center">
                    <h3 className="font-semibold">{userProfileData.name}</h3>
                    <p className="text-xs text-gray-600">
                      {userProfileData.headline}
                    </p>
                  </div>
                </div>
                <button
                  className="mt-3 w-full rounded-full border py-2 font-semibold text-blue-600 hover:bg-blue-50"
                  onClick={handleViewProfile}
                >
                  View Profile
                </button>

                <div className="mt-3">
                  <h4 className="text-xs text-gray-500 uppercase">Account</h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    <DropdownMenuItem>Settings & Privacy</DropdownMenuItem>
                    <DropdownMenuItem>Help</DropdownMenuItem>
                    <DropdownMenuItem>Posts & Activity</DropdownMenuItem>
                  </ul>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-3 w-full rounded-full border bg-red-50 py-2 text-red-700 hover:bg-red-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isSearchActive && (
        <form className="absolute top-0 left-0 flex h-[50px] w-full items-center bg-white px-4">
          <input
            type="text"
            autoFocus
            placeholder="Search"
            className="flex-1 rounded-md border bg-gray-100 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={toggleSearch}
            className="ml-3 text-gray-700"
            aria-label="Close search"
          >
            <HiX size={24} />
          </button>
        </form>
      )}
    </nav>
  );
};

export default React.memo(Navbar);
