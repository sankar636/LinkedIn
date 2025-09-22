import React, {
  createContext,
  useEffect,
  useContext,
  useState,
  useMemo,
} from 'react';
import { io } from 'socket.io-client';
import { UserDataContext } from './UserContext.jsx';
import toast, { Toaster } from 'react-hot-toast';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { userData } = useContext(UserDataContext);
  const [notifications, setNotifications] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  useEffect(() => {
    if (userData?._id) {
      const token = localStorage.getItem('token');
      const newSocket = io(
        "https://linkedin-q5gk.onrender.com" ,
        // 'http://localhost:4000',
        {
          auth: {
            token: token,
          },
          transports: ['websocket', 'polling'],
          path: '/socket.io',
        },
      );
      setSocket(newSocket);

      newSocket.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });

      newSocket.on('connect', () => {
        console.log(`Server connected on ID ${newSocket.id}`);
      });
      newSocket.on('connection-request', (notificationData) => {
        toast.success(
          `${notificationData.sender?.firstname || 'Someone'} sent you a connection request!`,
          {
            duration: 4000,
          },
        );
      });
      newSocket.on('Request_Accepted', (notificationData) => {
        toast.success(
          `${notificationData.sender?.firstname || 'Someone'} accepted your connection request!`,
          {
            duration: 4000,
          },
        );
      });
      newSocket.on('Post_Like', (notificationData) => {
        toast.success(
          `${notificationData.sender?.firstname || 'Someone'} Liked Your Post!`,
          {
            duration: 2000,
          },
        );
      });
      newSocket.on('New_Comment', (notificationData) => {
        toast.success(
          `${notificationData.sender?.firstname || 'Someone'} Commented on Your Post!`,
          {
            duration: 2000,
          },
        );
      });
      newSocket.on('newChat', (newChat) => {
        setLastMessage(newChat);
        toast.success(
          `You received a new message from ${newChat.sender?.firstname || 'Someone'}!`,
          {
            duration: 1000,
          },
        );
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });
      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [userData?._id]);

  const contextValue = useMemo(
    () => ({
      socket,
      onlineUsers,
      lastMessage,
    }),
    [socket, onlineUsers, lastMessage],
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
