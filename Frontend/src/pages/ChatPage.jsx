import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IoMdMenu } from 'react-icons/io';
import Navbar from '../components/Navbar.jsx';
import { useConnections } from '../context/ConnectionContext';
import ChatWindow from '../components/chatWindow.jsx';
import ChatSideBar from '../components/chatSideBar.jsx'; //

// Overlay component for mobile view
const Overlay = ({ onClick }) => (
  <div
    onClick={onClick}
    className="bg-opacity-50 fixed inset-0 z-20 h-screen bg-black md:hidden"
  ></div>
);

const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { connections, fetchConnections, loading } = useConnections();
  const location = useLocation();

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  useEffect(() => {
    if (location.state?.userId && connections.length > 0) {
      const userFromState = connections.find(
        (conn) => conn._id === location.state.userId,
      );
      if (userFromState) {
        setSelectedUser(userFromState);
      }
    }
  }, [location.state, connections]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarOpen(false);
  };

  return (
    <div className="mt-20 flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-y-hidden">
        <button
          className="absolute top-15 right-2 z-10 p-4 text-2xl md:hidden"
          onClick={() => setIsSidebarOpen(true)}
        >
          <IoMdMenu />
        </button>
        <ChatSideBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          loading={loading}
          connections={connections}
          selectedUser={selectedUser}
          handleUserSelect={handleUserSelect}
        />

        {/* Overlay to close sidebar on mobile */}
        {isSidebarOpen && <Overlay onClick={() => setIsSidebarOpen(false)} />}

        {/* Main Chat Content */}
        <main className="flex flex-1 flex-col">
          {selectedUser ? (
            <ChatWindow recipientUser={selectedUser} key={selectedUser._id} />
          ) : (
            <div className="flex flex-1 items-center justify-center bg-gray-200 p-4 text-center text-gray-500">
              {/* Hidden on mobile unless no user is selected */}
              <p className={`${isSidebarOpen ? 'hidden' : 'block'} md:block`}>
                Select a conversation to start chatting.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
