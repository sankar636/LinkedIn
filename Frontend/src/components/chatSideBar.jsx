import React from 'react';
import EmptyState from '../components/EmptyState';
import EmptyProfile from '/EmptyProfile.svg';
import { FaUserPlus, FaSearch, FaTimes } from "react-icons/fa";

const ChatSideBar = ({ isSidebarOpen, setIsSidebarOpen, loading, connections, selectedUser, handleUserSelect }) => {
    return (
        <aside className={`
            fixed md:static top-14 md:top-0 left-0 h-[calc(100vh-3rem)] md:h-full w-[85%] max-w-[350px]
            bg-white border-r flex flex-col z-30
            transform transition-transform duration-300 ease-in-out
            md:w-[35%] lg:w-[30%] md:translate-x-0
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
            <div className="p-4 font-bold border-b h-16 flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl">Chats</h2>
                <button
                    className="md:hidden text-2xl"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <FaTimes />
                </button>
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
                            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${selectedUser?._id === user._id ? 'bg-blue-50' : ''}`}
                            key={user._id}
                            onClick={() => handleUserSelect(user)}
                        >
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                <img src={user.profileImage || EmptyProfile} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h3 className="font-semibold text-gray-800 truncate">{user.name}</h3>
                                <p className="text-sm text-gray-600 truncate">{user.title || 'User'}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 mt-8">
                        <EmptyState icon={<FaUserPlus />} title="No Connections" description="Connect with users to start chatting." />
                    </div>
                )}
            </div>
        </aside>
    );
};

export default ChatSideBar;