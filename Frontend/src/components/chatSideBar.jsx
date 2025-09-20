import React from 'react'
import EmptyState from '../components/EmptyState';
import EmptyProfile from '/EmptyProfile.svg';
import { FaUserPlus, FaSearch  } from "react-icons/fa";

const ChatSideBar = ({ sidebarOpen, loading, connections, selectedUser, handleUserSelect }) => {    
    return (
        <>
            {sidebarOpen && <SidebarOverlay onClick={() => setSidebarOpen(false)} />}

            <div className={`
                absolute top-0 left-0 h-full w-[85%] max-w-[350px] bg-white border-r flex flex-col z-20 
                transform transition-transform duration-300 ease-in-out 
                sm:relative sm:max-w-[350px] sm:w-[35%] lg:w-[30%] sm:translate-x-0
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="p-4 font-bold border-b h-16 flex items-center flex-shrink-0">
                    <h2 className="text-xl">Chats</h2>
                </div>
                <div className="p-2 border-b bg-gray-50 flex-shrink-0">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search or start new chat"
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <p className="p-4 text-center text-gray-500">Loading...</p>
                    ) : connections.length > 0 ? (
                        connections.map((user) => (
                            <div
                                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${selectedUser?._id === user._id ? 'bg-blue-50' : ''}`}
                                key={user.id}
                                onClick={() => handleUserSelect(user)}
                            >
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                                    <img
                                        src={user.profileImage || EmptyProfile}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="font-semibold text-gray-800 truncate">{`${user.name}`}</h3>
                                    <p className="text-sm text-gray-600 truncate">{user.title || 'User'}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 mt-8">
                            <EmptyState
                                icon={<FaUserPlus />}
                                title="No Connections"
                                description="Connect with users to start chatting."
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ChatSideBar
