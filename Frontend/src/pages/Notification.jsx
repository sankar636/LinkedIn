import { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { HiOutlineUserAdd, HiOutlineThumbUp, HiOutlineChatAlt2 } from "react-icons/hi";
import { HiBellAlert } from "react-icons/hi2";
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar.jsx';
import { SocketContext } from '../context/SocketContext.jsx';
import axios from 'axios';
import { AuthDataContext } from '../context/AuthContext.jsx';

const getNotificationDetails = (notification) => {
    const { content, sender, post, comment } = notification;
    const senderName = `${sender?.firstname || 'Someone'} ${sender?.lastname || ''}`;    
    switch (content) {
        case "Connection_Request":
            return {
                icon: <HiOutlineUserAdd className="h-6 w-6 text-blue-600" />,
                message: <span><span className="font-bold">{senderName}</span> sent you a connection request.</span>,
            };
        case "Request_Accepted":
            return {
                icon: <HiOutlineUserAdd className="h-6 w-6 text-green-600" />,
                message: <span><span className="font-bold">{senderName}</span> accepted your connection request.</span>,
            };
        case "Post_Like":
            const postSnippet = post?.description
                ? post.description.length > 50
                    ? `"${post.description.substring(0, 50)}..."`
                    : `"${post.description}"`
                : null;

            return {
                icon: <HiOutlineThumbUp className="h-6 w-6 text-red-500" />,
                message: <div>
                    <span><span className="font-bold">{senderName}</span> liked your post.</span>
                    {postSnippet && (
                        <blockquote className="mt-2 pl-3 border-l-4 border-gray-300 text-sm text-gray-600 italic">
                            {postSnippet}
                        </blockquote>
                    )}
                </div>,
            };
        case "New_Comment":

            const commentSnippet = comment
                ? comment.length > 20
                    ? `"${comment.substring(0, 20)}..."`
                    : `"${comment}"`
                : null;                                
            const postCommentSnippet = post?.description
                ? post.description.length > 40
                    ? `"${post.description.substring(0, 40)}..."`
                    : `"${post.description}"`
                : null;                
            return {
                icon: <HiOutlineChatAlt2 className="h-6 w-6 text-gray-600" />,
                message: (
                    <div>
                        <span>
                            <span className="font-bold">{senderName}</span> commented on your post.
                        </span>
                        {commentSnippet && (
                            <blockquote className="mt-2 pl-3 border-l-4 border-blue-400 text-sm text-gray-800 italic">
                               comment: {commentSnippet}
                            </blockquote>
                        )}
                        {postCommentSnippet && (
                           <p className="mt-2 text-xs text-gray-500">
                                On post: <span className="italic">{postCommentSnippet}</span>
                           </p>
                        )}
                    </div>
                ),
            };
        default:
            return {
                icon: <HiBellAlert className="h-6 w-6 text-gray-500" />,
                message: <span>You have a new notification.</span>,
            };
    }
};

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { socket } = useContext(SocketContext) || {};
    const { serverUrl } = useContext(AuthDataContext);
    const getToken = useCallback(() => localStorage.getItem("token"), []);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const response = await axios.get(`${serverUrl}/notifications/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(response.data.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch notifications.");
            toast.error("Could not load notifications.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        if (!socket) return;
        const handleNewNotification = (newNotification) => {
            setNotifications(prev => [newNotification, ...prev]);
            toast.success("You have a new notification!");
        };
        socket.on('Connection_Request', handleNewNotification);
        socket.on('Post_Like', handleNewNotification);
        return () => {
            socket.off('Connection_Request', handleNewNotification);
            socket.off('Post_Like', handleNewNotification);
        };
    }, [socket]);



    const handleMarkOneAsRead = async (notification) => {
        if (notification.read) return;

        try {
            setNotifications(prev =>
                prev.map(n =>
                    n._id === notification._id ? { ...n, read: true } : n
                )
            );

            const token = getToken();
            await axios.patch(
                `${serverUrl}/notifications/${notification._id}/read`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            toast.error("Couldn't update notification status.");
            setNotifications(prev =>
                prev.map(n =>
                    n._id === notification._id ? { ...n, read: false } : n
                )
            );
            console.error(err);
        }
    };

    const handleProfileRedirect = (event, sender) => {
        event.stopPropagation();
        if (sender && sender.username) {
            navigate(`/profile/${sender.username}`);
        } else {
            toast.error("Could not find user profile.");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const token = getToken();
            await axios.post(
                `${serverUrl}/notifications/mark-read`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            toast.success("All notifications marked as read.");
        } catch (err) {
            toast.error("Failed to mark notifications as read.");
            console.error(err);
        }
    };

    const filteredNotifications = useMemo(() => {
        if (filter === 'unread') {
            return notifications.filter(n => !n.read);
        }
        return notifications;
    }, [notifications, filter]);

    const handleNotificationClick = (notification) => {
        handleMarkOneAsRead(notification);

        if (notification.content === "Post_Like" || notification.content === "New_Comment") {
            if (notification.sender && notification.sender.username) { // navigate to the sender profile page
                navigate(`/profile/${notification.sender.username}`);
            } else {
                toast.error("Post details not available.");
            }
        } else if (notification.content === "Connection_Request" || notification.content === "Request_Accepted") {
            if (notification.sender && notification.sender.username) {
                navigate(`/profile/${notification.sender.username}`);
            } else {
                toast.error("User profile not available.");
            }
        }
    };

    return (
        <div className='bg-gray-100 min-h-screen'>
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 py-8 mt-[70px]">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                        <button
                            onClick={handleMarkAllRead}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                            disabled={!notifications.some(n => !n.read)}
                        >
                            Mark all as read
                        </button>
                    </div>
                    <div className="p-2 border-b">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === 'unread' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Unread
                            </button>
                        </div>
                    </div>

                    <div>
                        {loading ? (
                            <p className="p-8 text-center text-gray-500">Loading notifications...</p>
                        ) : error ? (
                            <p className="p-8 text-center text-red-500">{error}</p>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <HiBellAlert className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900">
                                    {filter === 'unread' ? 'No unread notifications' : "You're all caught up!"}
                                </h3>
                                <p className="mt-1 text-sm">Check back later for new updates.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {filteredNotifications?.map((notification) => {
                                    const { icon, message } = getNotificationDetails(notification);
                                    return (
                                        <li
                                            key={notification._id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`p-4 flex items-start gap-4 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                        >
                                            <div
                                                className="flex-shrink-0 mt-1 z-10"
                                                onClick={(e) => handleProfileRedirect(e, notification.sender)}
                                            >
                                                {icon}
                                            </div>

                                            <div className="flex-grow">
                                                <div className="text-sm text-gray-700">{message}</div>

                                                <p className="text-xs text-gray-500 mt-1">
                                                    {notification.updatedAt ? (
                                                        formatDistanceToNow(new Date(notification.updatedAt), { addSuffix: true })
                                                    ) : (
                                                        <span className="text-gray-400">Just now</span>
                                                    )}
                                                </p>
                                            </div>

                                            {!notification.read && (
                                                <div className="flex-shrink-0">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Notification;