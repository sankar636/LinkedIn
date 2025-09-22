import React from 'react';
import EmptyState from '../components/EmptyState';
import EmptyProfile from '/EmptyProfile.svg';
import { FaUserPlus, FaSearch, FaTimes } from 'react-icons/fa';

const ChatSideBar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  loading,
  connections,
  selectedUser,
  handleUserSelect,
}) => {
  return (
    <aside
      className={`fixed top-14 left-0 z-30 flex h-[calc(100vh-3rem)] w-[85%] max-w-[350px] transform flex-col border-r bg-white transition-transform duration-300 ease-in-out md:static md:top-0 md:h-full md:w-[35%] md:translate-x-0 lg:w-[30%] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} `}
    >
      <div className="flex h-16 flex-shrink-0 items-center justify-between border-b p-4 font-bold">
        <h2 className="text-xl">Chats</h2>
        <button
          className="text-2xl md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <FaTimes />
        </button>
      </div>

      <div className="flex-shrink-0 border-b bg-gray-50 p-2">
        <div className="relative">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full rounded-full border border-transparent bg-gray-100 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="p-4 text-center text-gray-500">Loading...</p>
        ) : connections.length > 0 ? (
          connections.map((user) => (
            <div
              className={`flex cursor-pointer items-center gap-3 p-3 hover:bg-gray-100 ${selectedUser?._id === user._id ? 'bg-blue-50' : ''}`}
              key={user._id}
              onClick={() => handleUserSelect(user)}
            >
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                <img
                  src={user.profileImage || EmptyProfile}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="truncate font-semibold text-gray-800">
                  {user.name}
                </h3>
                <p className="truncate text-sm text-gray-600">
                  {user.title || 'User'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="mt-8 p-4">
            <EmptyState
              icon={<FaUserPlus />}
              title="No Connections"
              description="Connect with users to start chatting."
            />
          </div>
        )}
      </div>
    </aside>
  );
};

export default ChatSideBar;
