import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { useAuth } from './AuthContext'; // Assuming your AuthContext provides the logged-in user object
import axios from 'axios';
import { useUser } from './UserContext';

export const ConnectionDataContext = createContext();

export const useConnections = () => {
  const context = useContext(ConnectionDataContext);
  if (!context) {
    throw new Error('useConnections must be used within a ConnectionProvider');
  }
  return context;
};

const ConnectionProvider = ({ children }) => {
  const { serverUrl } = useAuth();
  const { userData } = useUser();
  const [connections, setConnections] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]); // Incoming requests
  const [outgoingRequests, setOutgoingRequests] = useState([]); // Outgoing requests (IDs only)
  const [ignoreRequests, setIgnoreRequests] = useState([]); // Ignored requests (IDs only)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getToken = useCallback(() => localStorage.getItem('token'), []);

  const fetchConnections = useCallback(async () => {
    const token = getToken();
    const userId = userData?._id;

    if (!token || !userId) return; // Don't fetch if not logged in

    setLoading(true);
    setError('');
    try {
      // Use the updated backend route
      const { data } = await axios.get(
        `${serverUrl}/connections/getConnections`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const accepted = [];
      const incoming = [];
      const outgoingIds = [];
      const ignoredIds = [];

      (data.data || []).forEach((conn) => {
        // Determine who the "other side user" is in the connection object
        const otherUser =
          conn.requester._id === userId ? conn.recipient : conn.requester;
        // Format the user object for the frontend
        const formattedUser = {
          id: otherUser._id,
          name: `${otherUser.firstname} ${otherUser.lastname}`,
          title: otherUser.username,
          profileImage: otherUser.profileImage,
        };
        // console.log(formattedUser);

        if (conn.status === 'accepted') {
          if (!accepted.some((u) => u.id === formattedUser.id)) {
            accepted.push(formattedUser);
          }
        } else if (conn.status === 'pending') {
          // It's an incoming request if the current user is the recipient
          if (conn.recipient._id === userId) {
            // console.log("Incoming Request from",formattedUser);
            incoming.push(formattedUser);
          } else {
            // Otherwise, it's an outgoing request
            // console.log("Outgoing Request to",formattedUser);
            outgoingIds.push(otherUser._id);
          }
        } else if (conn.status === 'ignored') {
          // If current user is recipient, they ignored the request
          if (conn.recipient._id === userId) {
            ignoredIds.push(otherUser._id);
            incoming.push(formattedUser);
          } else {
            outgoingIds.push(otherUser._id);
          }
        }
      });

      setConnections(accepted);
      setConnectionRequests(incoming);
      setOutgoingRequests(outgoingIds);
      setIgnoreRequests(ignoredIds);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch network data');
    } finally {
      setLoading(false);
    }
  }, [serverUrl, getToken, userData]);

  // Send a new connection request
  const sendConnectionRequest = useCallback(
    async (recipientId) => {
      const token = getToken();
      try {
        await axios.post(
          `${serverUrl}/connections/connect/${recipientId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setOutgoingRequests((prev) => [...prev, recipientId]);
      } catch (err) {
        console.error('Failed to send connection request:', err);
        setError(err.response?.data?.message || 'Failed to send request');
        throw err; // Re-throw to be caught in the component
      }
    },
    [serverUrl, getToken],
  );

  // Accept an incoming connection request
  const acceptConnection = useCallback(
    async (requesterId) => {
      const token = getToken();
      try {
        await axios.post(
          `${serverUrl}/connections/accept/${requesterId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const requestToAccept = connectionRequests.find(
          (req) => req.id === requesterId,
        );
        if (requestToAccept) {
          setConnectionRequests((prev) =>
            prev.filter((req) => req.id !== requesterId),
          );
          setIgnoreRequests((prev) => prev.filter((id) => id !== requesterId));
          setConnections((prev) => [requestToAccept, ...prev]);
        }
      } catch (err) {
        console.error('Failed to accept connection:', err);
        setError(err.response?.data?.message || 'Failed to accept connection');
        throw err;
      }
    },
    [serverUrl, getToken, connectionRequests],
  );

  // Reject an incoming connection request
  const ignoreConnection = useCallback(
    async (otherUserId) => {
      const token = getToken();
      try {
        await axios.post(
          `${serverUrl}/connections/ignore/${otherUserId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const requestToIgnore = connectionRequests.find(
          (req) => req.id === otherUserId,
        );
        if (requestToIgnore) {
          setConnectionRequests((prev) =>
            prev.filter((req) => req.id !== otherUserId),
          );
          setIgnoreRequests((prev) => [...prev, otherUserId]);
        }
      } catch (err) {
        console.error('Failed to reject connection:', err);
        setError(err.response?.data?.message || 'Failed to reject connection');
        throw err;
      }
    },
    [serverUrl, getToken, connectionRequests],
  );

  // This value is passed down to consuming components
  const connectionValue = useMemo(
    () => ({
      loading,
      error,
      connections,
      connectionRequests,
      outgoingRequests,
      ignoreRequests,
      fetchConnections,
      sendConnectionRequest,
      acceptConnection,
      ignoreConnection,
    }),
    [
      loading,
      error,
      connections,
      connectionRequests,
      outgoingRequests,
      ignoreRequests,
      fetchConnections,
      sendConnectionRequest,
      acceptConnection,
      ignoreConnection,
    ],
  );

  return (
    <ConnectionDataContext.Provider value={connectionValue}>
      {children}
    </ConnectionDataContext.Provider>
  );
};

export default ConnectionProvider;
