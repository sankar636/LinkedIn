import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillHome, AiOutlineBell, AiOutlineSearch } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaUserFriends } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import LinkedIn from '/linkedin.png';
import { UserDataContext } from "../context/UserContext";
import EmptyProfile from '/EmptyProfile.svg'
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";

const Navbar = () => {
    const { userData, setUserData } = useContext(UserDataContext);
    let {serverUrl} = useContext(AuthDataContext)
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(serverUrl+`/auth/logout`, {}, { 
                withCredentials: true 
            });
            setUserData(null);
            localStorage.removeItem("token");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="w-full absolute top-0 bg-white shadow-sm flex items-center justify-between px-4 py-2 z-50 gap-2">
            <div className="flex items-center gap-3 flex-1 relative">
                <img src={LinkedIn} alt="LinkedIn" className="h-8 w-8" />
                <form className="hidden sm:flex flex-1">
                    <input
                        type="text"
                        placeholder="Search"
                        className="px-4 py-2 border rounded-md bg-gray-100 focus:outline-none focus:border-blue-500 w-full max-w-sm"
                    />
                </form>
                <button
                    className="sm:hidden ml-2 text-gray-700"
                    onClick={() => setIsSearchActive(true)}
                >
                    <AiOutlineSearch size={24} />
                </button>
            </div>

            <div className={`flex items-center gap-6 sm:gap-8 pr-4 ${isSearchActive ? "hidden" : ""}`}>
                <Link to="/" className="flex flex-col items-center text-gray-700 hover:text-blue-600 gap-1">
                    <AiFillHome size={22} />
                    <span className="text-[10px] sm:text-xs">Home</span>
                </Link>
                <Link to="/network" className="flex flex-col items-center text-gray-700 hover:text-blue-600 gap-1">
                    <FaUserFriends size={22} />
                    <span className="text-[10px] sm:text-xs">Network</span>
                </Link>
                <Link to="/notifications" className="flex flex-col items-center text-gray-700 hover:text-blue-600 gap-1">
                    <AiOutlineBell size={22} />
                    <span className="text-[10px] sm:text-xs">Notifications</span>
                </Link>

                <div className="relative flex flex-col items-center cursor-pointer" ref={dropdownRef}>
                    <CgProfile
                        size={26}
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                    />
                    <span className="text-[10px] sm:text-xs">Me</span>

                    {isDropdownOpen && (
                        <div className="absolute top-12 right-0 w-72 bg-white border rounded-lg shadow-lg p-4 z-50">
                            <div className="flex flex-col items-center justify-around gap-3 pb-3 border-b">
                                <img
                                    src={userData?.profilePic || `${EmptyProfile}`}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full"
                                />
                                <div>
                                    <h3 className="font-semibold">
                                        {userData?.firstname} {userData?.lastname}
                                    </h3>
                                    <p className="text-xs text-gray-600">{userData?.headline}</p>
                                </div>
                            </div>
                            <button className="w-full mt-3 py-2 border rounded-full text-blue-600 font-semibold hover:bg-blue-50">
                                View Profile
                            </button>

                            <div className="mt-3">
                                <h4 className="text-gray-500 text-xs uppercase">Account</h4>
                                <ul className="space-y-2 mt-2 text-sm">
                                    <li className="hover:bg-gray-100 p-1 rounded">Settings & Privacy</li>
                                    <li className="hover:bg-gray-100 p-1 rounded">Help</li>
                                    <li className="hover:bg-gray-100 p-1 rounded">Posts & Activity</li>
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
                        onClick={() => setIsSearchActive(false)}
                        className="ml-3 text-gray-700"
                    >
                        <HiX size={24} />
                    </button>
                </form>
            )}
        </nav>
    );
};

export default Navbar;
