import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext.jsx';
import { SocketContext } from '../context/SocketContext.jsx';
import { AuthDataContext } from '../context/AuthContext.jsx';
import { FiSend } from 'react-icons/fi';
import EmptyProfile from '/EmptyProfile.svg';

const ChatWindow = ({ recipientUser }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { userData } = useUser();
  const { serverUrl } = useContext(AuthDataContext);
  const { lastMessage } = useContext(SocketContext);
  const messagesEndRef = useRef(null);

  const getToken = useCallback(() => localStorage.getItem('token'), []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!recipientUser?.id) return;

      setLoading(true);
      try {
        const token = getToken();
        const res = await axios.get(`${serverUrl}/chat/${recipientUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch messages', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [recipientUser?.id]);
  useEffect(() => {
    if (lastMessage && userData?._id) {
      if (
        lastMessage.receiver === userData._id &&
        lastMessage.sender === recipientUser?.id
      ) {
        setMessages((prevMessages) => {
          if (prevMessages.some((msg) => msg._id === lastMessage._id)) {
            return prevMessages;
          }
          return [...prevMessages, lastMessage];
        });
      }
    }
  }, [lastMessage, recipientUser?.id, userData._id]);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const token = getToken();
      const res = await axios.post(
        `${serverUrl}/chat/send/${recipientUser.id}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages([...messages, res.data.data]);
      setContent('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div className="flex h-full flex-col bg-gray-200">
      <div className="flex h-16 flex-shrink-0 items-center border-b-2 border-gray-300 bg-white px-4">
        <img
          src={recipientUser?.profileImage || EmptyProfile}
          alt={recipientUser.name}
          className="mr-4 h-10 w-10 rounded-full"
        />
        <h2 className="text-xl font-semibold">{`${recipientUser.name}`}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id || Math.random()}
              className={`mb-4 flex ${msg.sender === userData._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-lg px-4 py-2 shadow lg:max-w-md ${
                  msg.sender === userData._id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSendMessage}
        className="flex h-16 flex-shrink-0 items-center border-t border-gray-300 bg-white px-4"
      >
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-gray-300 bg-gray-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="ml-3 rounded-full bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          disabled={!content.trim()}
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
