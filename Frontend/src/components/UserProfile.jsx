import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineEdit } from 'react-icons/md';
import { FiBriefcase, FiBookOpen } from 'react-icons/fi';
import EmptyProfile from '/EmptyProfile.svg';
import { useUser } from '../context/UserContext.jsx';
import { useConnections } from '../context/ConnectionContext.jsx';
import { SocketContext } from '../context/SocketContext';
import { Link } from 'react-router-dom';

const UserProfile = ({ username }) => {
  const {
    userData: loggedInUser,
    profileData,
    userPosts,
    loadingProfile,
    error,
    setEdit,
    getUserProfile,
  } = useUser();
  const {
    sendConnectionRequest,
    fetchConnections,
    acceptConnection,
    connections,
    connectionRequests,
    ignoreConnection,
    ignoreRequests,
    outgoingRequests,
  } = useConnections();
  const navigate = useNavigate();
  const [connectionError, setConnectionError] = useState(null);
  const { socket } = useContext(SocketContext);

  // console.log("Connections",connections);
  // console.log("Request",connectionRequests);
  // console.log("Outgoing",outgoingRequests);
  // console.log("ignored",ignoreRequests);

  // useEffect(() => {
  //     if(socket && loggedInUser?.id){
  //       socket.emit('join', { userId: loggedInUser?._id });
  //       console.log("Socket joined with userId:", loggedInUser?._id);

  //     }
  //   },[socket, loggedInUser])

  //   socket.on('notification', (data) => {
  //     console.log("New notification received:", data);

  //   })
  const handleSendRequest = async (userId) => {
    setConnectionError(null);
    try {
      await sendConnectionRequest(userId);
    } catch (error) {
      setConnectionError('Failed to send connection request.');
      console.log('Error sending Connection request ', error);
    }
  };
  const handleAcceptRequest = async (userId) => {
    setConnectionError(null);
    // console.log(userId);
    try {
      await acceptConnection(userId);
    } catch (err) {
      setConnectionError('Failed to accept request.');
      console.error('Error accepting connection request:', err);
    }
  };

  const handelIgnoreRequest = async (userId) => {
    setConnectionError(null);
    try {
      await ignoreConnection(userId);
    } catch (err) {
      setConnectionError('Failed to ignore request.');
      console.error('Error accepting connection request:', err);
    }
  };
  const isConnected = useMemo(() => {
    if (!profileData?._id) return false; // ✅ safe check
    return connections.some((conn) => conn.id === profileData._id);
  }, [connections, profileData]);

  const isPending = useMemo(() => {
    // console.log("profileData:", JSON.stringify(profileData, null, 2));
    if (!profileData?._id) return false; // ✅ safe check
    return outgoingRequests.includes(profileData._id);
  }, [outgoingRequests, profileData]);

  const isRequestReceived = useMemo(() => {
    if (!profileData?._id) return false; // ✅ safe check
    return connectionRequests.some((req) => req.id === profileData._id);
  }, [connectionRequests, profileData]);

  const isIgnored = useMemo(() => {
    if (!profileData?._id) return false;
    return ignoreRequests.includes(profileData._id);
  }, [ignoreRequests, profileData]);

  useEffect(() => {
    if (username) {
      getUserProfile(username);
    }
  }, [username, getUserProfile]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  if (loadingProfile)
    return <p className="p-10 text-center">Loading profile...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;
  if (!profileData)
    return <p className="p-10 text-center">No profile found.</p>;

  const isOwnProfile = loggedInUser?._id === profileData._id;

  const renderConnectionButton = () => {
    if (isOwnProfile) return null;
    if (isConnected) {
      return (
        <Link
          to="/chatPage"
          state={{
            userId: profileData._id,
            name: profileData.firstname,
            connections: connections,
          }}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 font-semibold text-blue-600 hover:bg-blue-50"
        >
          Message
        </Link>
      );
    }
    // If current user is recipient and ignored the request
    if (isIgnored) {
      return (
        <div className="flex gap-2">
          <button
            disabled
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 font-semibold text-gray-500 hover:bg-gray-50"
          >
            Ignored
          </button>
          <button
            onClick={() => handleAcceptRequest(profileData._id)}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full border bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          >
            Accept Again
          </button>
        </div>
      );
    }
    // If current user sent request and it was ignored or pending
    if (isPending) {
      return (
        <button
          disabled
          className="flex cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 font-semibold text-blue-600 hover:bg-blue-50"
        >
          Pending
        </button>
      );
    }
    // If current user received a request
    if (isRequestReceived) {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleAcceptRequest(profileData._id)}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full border bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          >
            Accept
          </button>
          <button
            onClick={() => handelIgnoreRequest(profileData._id)}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full border bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
          >
            Ignore
          </button>
        </div>
      );
    }
    // Default: show connect button
    return (
      <button
        onClick={() => handleSendRequest(profileData._id)}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 font-semibold text-blue-600 hover:bg-blue-50"
      >
        Connect
      </button>
    );
  };

  return (
    <div className="mx-auto my-4 w-full max-w-4xl rounded-lg bg-white p-6 shadow-md">
      <div className="relative">
        <div className="h-[150px] w-full overflow-hidden rounded bg-gray-300">
          <img
            src={profileData.coverImage || ' '}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute top-[100px] left-[30px] h-[100px] w-[100px] overflow-hidden rounded-full border-4 border-white shadow-md">
          <img
            src={profileData.profileImage || EmptyProfile}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="mt-16 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {profileData.firstname} {profileData.lastname}
          </h2>
          <p className="text-gray-600">
            {profileData.headline || 'No headline provided'}
          </p>
          <p className="text-gray-400">
            {profileData.location || 'Location not specified'}
          </p>
          {isConnected && !isOwnProfile ? (
            <p>Connected with User</p>
          ) : (
            <p>Not Connected with User</p>
          )}
          {isIgnored && !isOwnProfile && <p>You have ignored this user</p>}
        </div>
        {isOwnProfile ? (
          <button
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 font-semibold text-blue-600 hover:bg-blue-50"
            onClick={() => {
              setEdit(true);
              navigate('/');
            }}
          >
            Edit Profile <MdOutlineEdit />
          </button>
        ) : (
          renderConnectionButton()
        )}
      </div>

      {profileData.skills?.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {profileData.experience?.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 flex items-center text-lg font-semibold">
            <FiBriefcase className="mr-2 h-5 w-5" /> Experience
          </h3>
          {profileData.experience.map((exp, index) => (
            <div key={index} className="mb-4 border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">{exp.title}</h4>
              <p className="text-gray-600">{exp.company}</p>
              <p className="text-sm text-gray-500">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {profileData.education?.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 flex items-center text-lg font-semibold">
            <FiBookOpen className="mr-2 h-5 w-5" /> Education
          </h3>
          {profileData.education.map((edu, index) => (
            <div key={index} className="mb-4 border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">{edu.degree}</h4>
              <p className="text-gray-600">{edu.college}</p>
              <p className="text-sm text-gray-500">{edu.fieldOfStudy}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <h3 className="mb-2 text-lg font-semibold">Activity</h3>
        {userPosts?.length > 0 ? (
          userPosts.map((post) => (
            <div
              key={post._id}
              className="mb-3 rounded-lg border p-3 shadow-sm"
            >
              <p className="text-gray-800">{post.description}</p>
              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
