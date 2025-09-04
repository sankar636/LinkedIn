import React, { useState } from 'react'
import { FaUsers, FaEye, FaUserFriends, FaCalendarAlt, FaNewspaper, FaBell, FaTags, FaBuilding, FaGraduationCap, FaTimes, FaBars } from 'react-icons/fa';
import SideBarItem from './SideBarItem.jsx';

const NetworkSidebar = ({ activeTab, setActiveTab }) => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    const sidebarItems = [
        { key: "connections", text: "Connections", icon: <FaUsers size={20} />, count: 543 },
        { key: "followingfollowers", text: "Following & Followers", icon: <FaEye size={20} />, count: 0 },
        { key: "groups", text: "Groups", icon: <FaUserFriends size={20} />, count: 12 },
        { key: "events", text: "Events", icon: <FaCalendarAlt size={20} />, count: 5 },
        { key: "newsletters", text: "Newsletters", icon: <FaNewspaper size={20} />, count: 3 },
        { key: "notifications", text: "Notifications", icon: <FaBell size={20} />, count: 23 },
        { key: "hashtags", text: "Hashtags", icon: <FaTags size={20} />, count: 8 },
        { key: "companies", text: "Companies", icon: <FaBuilding size={20} />, count: 17 },
        { key: "schools", text: "Schools", icon: <FaGraduationCap size={20} />, count: 2 },
    ];

    return (
        <div className="space-y-1 ">
            <button
                className="sm:hidden fixed top-16 right-0 z-50 p-2 bg-blue-500 text-white rounded-md shadow-lg"
                onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            >
                {isSideBarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

            {isSideBarOpen && (
                <div
                    className="fixed inset-0 bg-opacity-50 z-40 sm:hidden"
                    onClick={() => setIsSideBarOpen(false)}
                ></div>
            )}
            <div className={`
                fixed sm:relative inset-y-0 left-0 z-40 w-full pr-10 bg-white transform transition-transform duration-300 ease-in-out
                ${isSideBarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
                `}>
                <div className="p-4 space-y-1 overflow-y-auto h-full">
                    <div className="flex items-center justify-between mb-6 sm:mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Network</h2>
                        <button
                            className="md:hidden text-gray-500 hover:text-gray-700"
                            onClick={() => setIsSideBarOpen(false)}
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {sidebarItems.map(item => (
                        <SideBarItem
                            key={item.key}
                            icon={item.icon}
                            text={item.text}
                            count={item.count}
                            isActive={activeTab === item.key}
                            onClick={() => {
                                setActiveTab(item.key);
                                
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NetworkSidebar