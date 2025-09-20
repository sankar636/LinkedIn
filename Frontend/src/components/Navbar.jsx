import React, { useContext, useState, useRef, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillHome, AiOutlineBell, AiOutlineSearch } from "react-icons/ai";
import { RiMessage2Fill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { FaUserFriends } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import LinkedIn from '/linkedin.png';
import { UserDataContext } from "../context/UserContext";
import EmptyProfile from '/EmptyProfile.svg';
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";

const NavItem = React.memo(({ to, icon: Icon, label, onClick }) => (
    <Link
        to={to}
        className="flex flex-col items-center text-gray-700 hover:text-blue-600 gap-1"
        onClick={onClick}
    >
        <Icon size={22} />
        <span className="text-[10px] sm:text-xs">{label}</span>
    </Link>
));

NavItem.displayName = 'NavItem';

const DropdownMenuItem = React.memo(({ children, onClick }) => (
    <li
        className="hover:bg-gray-100 p-1 rounded cursor-pointer"
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
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Memoized logout handler
    const handleLogout = useCallback(async () => {
        try {
            await axios.post(`${serverUrl}/auth/logout`, {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUserData(null);
            localStorage.removeItem("token");
            navigate("/login");
        }
    }, [serverUrl, setUserData, navigate]);

    // Memoized navigation handlers
    const handleViewProfile = useCallback(() => {
        navigate('/profile');
        setIsDropdownOpen(false);
    }, [navigate]);

    const toggleDropdown = useCallback(() => {
        setIsDropdownOpen(prev => !prev);
    }, []);

    const toggleSearch = useCallback(() => {
        setIsSearchActive(prev => !prev);
    }, []);

    // Memoized user profile data
    const userProfileData = useMemo(() => ({
        name: `${userData?.firstname || ''} ${userData?.lastname || ''}`.trim(),
        headline: userData?.headline || '',
        profileImage: userData?.profileImage || EmptyProfile
    }), [userData]);

    // Memoized navigation items configuration
    const navItems = useMemo(() => [
        { to: "/", icon: AiFillHome, label: "Home" },
        { to: "/network", icon: FaUserFriends, label: "Network" },
        { to: "/notification", icon: AiOutlineBell, label: "Notifications" },
        {to: "/chatPage", icon: RiMessage2Fill, label: "Message"}
    ], []);

    return (
        <nav className="w-full fixed top-0 bg-white shadow-sm flex items-center justify-between px-4 py-2 z-50 gap-2">
            <div className="flex items-center gap-3 flex-1 relative">
                <img
                    src={LinkedIn}
                    alt="LinkedIn"
                    className="h-8 w-8"
                />
                <form className="hidden sm:flex flex-1">
                    <input
                        type="text"
                        placeholder="Search"
                        className="px-4 py-2 border rounded-md bg-gray-100 focus:outline-none focus:border-blue-500 w-full max-w-sm"
                    />
                </form>
                <button
                    className="sm:hidden ml-2 text-gray-700"
                    onClick={toggleSearch}
                    aria-label="Search"
                >
                    <AiOutlineSearch size={24} />
                </button>
            </div>

            {!isSearchActive && (
                <div className="flex items-center gap-6 sm:gap-8 pr-4">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            label={item.label}
                        />
                    ))}

                    <div className="relative flex flex-col items-center cursor-pointer" ref={dropdownRef}>
                        <CgProfile
                            size={26}
                            onClick={toggleDropdown}
                            aria-label="Profile menu"
                        />
                        <span className="text-[10px] sm:text-xs">Me</span>

                        {isDropdownOpen && (
                            <div className="absolute top-12 right-0 w-72 bg-white border rounded-lg shadow-lg p-4 z-50">
                                <div className="flex flex-col items-center justify-around gap-3 pb-3 border-b">
                                    <img
                                        src={userProfileData.profileImage}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                    <div className="text-center">
                                        <h3 className="font-semibold">
                                            {userProfileData.name}
                                        </h3>
                                        <p className="text-xs text-gray-600">{userProfileData.headline}</p>
                                    </div>
                                </div>
                                <button
                                    className="w-full mt-3 py-2 border rounded-full text-blue-600 font-semibold hover:bg-blue-50"
                                    onClick={handleViewProfile}
                                >
                                    View Profile
                                </button>

                                <div className="mt-3">
                                    <h4 className="text-gray-500 text-xs uppercase">Account</h4>
                                    <ul className="space-y-2 mt-2 text-sm">
                                        <DropdownMenuItem>Settings & Privacy</DropdownMenuItem>
                                        <DropdownMenuItem>Help</DropdownMenuItem>
                                        <DropdownMenuItem>Posts & Activity</DropdownMenuItem>
                                    </ul>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full mt-3 py-2 border rounded-full text-red-700 bg-red-50 hover:bg-red-200"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isSearchActive && (
                <form className="absolute top-0 left-0 w-full h-[50px] bg-white flex items-center px-4">
                    <input
                        type="text"
                        autoFocus
                        placeholder="Search"
                        className="flex-1 px-4 py-2 border rounded-md bg-gray-100 focus:outline-none focus:border-blue-500"
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