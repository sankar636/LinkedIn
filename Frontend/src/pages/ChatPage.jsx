import React, { useContext, useState, useEffect } from 'react';
import { IoMdMenu } from "react-icons/io";
import { FaUserPlus } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import { SocketContext } from '../context/SocketContext.jsx';
import Navbar from '../components/Navbar.jsx';
import { useConnections } from '../context/ConnectionContext';
import EmptyState from '../components/EmptyState';
import EmptyProfile from '/EmptyProfile.svg';
import ChatWindow from '../components/chatWindow.jsx';
import ChatSideBar from '../components/chatSideBar.jsx';

const ChatPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { userData } = useUser();
    const { socket, onlineUsers } = useContext(SocketContext);
    const { connections, fetchConnections, loading } = useConnections();
    const location = useLocation();

    useEffect(() => {
        fetchConnections();
    }, [fetchConnections]);

    useEffect(() => {
        if (location.state?.userId && connections.length > 0) {
            const userFromState = connections.find(conn => conn._id === location.state.userId);
            if (userFromState) {
                setSelectedUser(userFromState);
            }
        }
    }, [location.state, connections]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setSidebarOpen(false);
    };

    return (
        <div className='h-[screen-20px] w-full bg-gray-100 flex flex-col mt-20'>
            <Navbar />
            <div className="flex flex-1 overflow-hidden"> 
                <div className="sm:hidden absolute top-16 left-4 z-30">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <IoMdMenu className="h-6 w-6" />
                    </button>
                </div>

                <ChatSideBar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    loading={loading}
                    connections={connections}
                    selectedUser={selectedUser}
                    handleUserSelect={handleUserSelect}
                />
                <div className="flex-1 flex flex-col">
                    {selectedUser ? (
                        <ChatWindow recipientUser={selectedUser} key={selectedUser._id} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-200 text-gray-500">
                            <p>Select a conversation to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatPage;