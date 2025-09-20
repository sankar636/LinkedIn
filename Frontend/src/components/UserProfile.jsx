import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineEdit } from "react-icons/md";
import { FiBriefcase, FiBookOpen } from "react-icons/fi";
import EmptyProfile from '/EmptyProfile.svg';
import { useUser } from '../context/UserContext.jsx';
import { useConnections } from '../context/ConnectionContext.jsx';
import { SocketContext } from '../context/SocketContext';
import { Link } from 'react-router-dom';


const UserProfile = ({ username }) => {
    const {userData: loggedInUser, profileData, userPosts, loadingProfile, error, setEdit, getUserProfile} = useUser();
    const { sendConnectionRequest, fetchConnections, acceptConnection, connections, connectionRequests, ignoreConnection, ignoreRequests, outgoingRequests } = useConnections();
    const navigate = useNavigate();
    const [connectionError, setConnectionError] = useState(null)
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
    const handleSendRequest = async(userId) => {
        setConnectionError(null);
        try {
            await sendConnectionRequest(userId);
        } catch (error) {
            setConnectionError("Failed to send connection request.");
            console.log("Error sending Connection request ", error);
        }
    }
    const handleAcceptRequest = async (userId) => {
        setConnectionError(null)
        // console.log(userId);        
        try {
            await acceptConnection(userId);
        } catch (err) {
            setConnectionError("Failed to accept request.");
            console.error("Error accepting connection request:", err);
        }
    };

    const handelIgnoreRequest = async (userId) => {
        setConnectionError(null)
        try {
            await ignoreConnection(userId);
        } catch (err) {
            setConnectionError("Failed to ignore request.");
            console.error("Error accepting connection request:", err);
        }
    };
    const isConnected = useMemo(() => {
        if (!profileData?._id) return false; // ✅ safe check
        return connections.some(conn => conn.id === profileData._id);
    }, [connections, profileData]);
    
    const isPending = useMemo(() => {
        // console.log("profileData:", JSON.stringify(profileData, null, 2));        
        if (!profileData?._id) return false; // ✅ safe check
        return outgoingRequests.includes(profileData._id);
    }, [outgoingRequests, profileData]);
    
    const isRequestReceived = useMemo(() => {
        if (!profileData?._id) return false; // ✅ safe check
        return connectionRequests.some(req => req.id === profileData._id);
    }, [connectionRequests, profileData]);

    const isIgnored = useMemo(() => {
        if(!profileData?._id) return false;
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

    if (loadingProfile) return <p className="text-center p-10">Loading profile...</p>;
    if (error) return <p className="text-center text-red-500 p-10">{error}</p>;
    if (!profileData) return <p className="text-center p-10">No profile found.</p>;

    const isOwnProfile = loggedInUser?._id === profileData._id;

    const renderConnectionButton = () => {
        if (isOwnProfile) return null;
        if (isConnected) {
            return <Link to="/chatPage" 
            state = {{userId: profileData._id, name: profileData.firstname, connections: connections}}
            className="py-2 px-4 border rounded-full text-blue-600 font-semibold hover:bg-blue-50 flex items-center justify-center gap-2 cursor-pointer"           
            >Message</Link>;
        }
        // If current user is recipient and ignored the request
        if (isIgnored) {
            return (
                <div className='flex gap-2'>
                    <button disabled className="py-2 px-4 border rounded-full text-gray-500 font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 cursor-pointer">Ignored</button>
                    <button onClick={() => handleAcceptRequest(profileData._id)} className="py-2 px-4 border rounded-full text-white font-semibold bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2 cursor-pointer">Accept Again</button>
                </div>
            );
        }
        // If current user sent request and it was ignored or pending
        if (isPending) {
            return <button disabled className="py-2 px-4 border rounded-full text-blue-600 font-semibold hover:bg-blue-50 flex items-center justify-center gap-2 cursor-pointer">Pending</button>;
        }
        // If current user received a request
        if (isRequestReceived) {
            return (
                <div className='flex gap-2'>
                    <button onClick={() => handleAcceptRequest(profileData._id)} className="py-2 px-4 border rounded-full text-white font-semibold bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2 cursor-pointer">Accept</button>
                    <button onClick={() => handelIgnoreRequest(profileData._id)} className="py-2 px-4 border rounded-full text-white font-semibold bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2 cursor-pointer">Ignore</button>
                </div>
            );
        }
        // Default: show connect button
        return <button onClick={() => handleSendRequest(profileData._id)} className="py-2 px-4 border rounded-full text-blue-600 font-semibold hover:bg-blue-50 flex items-center justify-center gap-2 cursor-pointer">Connect</button>;
    };
        

    return (
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 my-4 mx-auto">
            <div className="relative">
                <div className="w-full h-[150px] bg-gray-300 rounded overflow-hidden">
                    <img src={profileData.coverImage || " "} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden absolute top-[100px] left-[30px] border-4 border-white shadow-md">
                    <img
                        src={profileData.profileImage || EmptyProfile}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <div className="mt-16 flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold">{profileData.firstname} {profileData.lastname}</h2>
                    <p className="text-gray-600">{profileData.headline || "No headline provided"}</p>
                    <p className="text-gray-400">{profileData.location || "Location not specified"}</p>
                    {isConnected && !isOwnProfile ? <p>Connected with User</p> : <p>Not Connected with User</p> }
                    {isIgnored && !isOwnProfile && <p>You have ignored this user</p> }
                </div>
                {isOwnProfile ? (
                    <button
                        className="py-2 px-4 border rounded-full text-blue-600 font-semibold hover:bg-blue-50 flex items-center justify-center gap-2 cursor-pointer"
                        onClick={() => {
                            setEdit(true);
                            navigate('/');
                        }}
                    >
                        Edit Profile <MdOutlineEdit />
                    </button>
                ): (
                    renderConnectionButton()
                )}
            </div>

            {profileData.skills?.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {profileData.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {profileData.experience?.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <FiBriefcase className="w-5 h-5 mr-2" /> Experience
                    </h3>
                    {profileData.experience.map((exp, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4 mb-4">
                            <h4 className="font-medium">{exp.title}</h4>
                            <p className="text-gray-600">{exp.company}</p>
                            <p className="text-gray-500 text-sm">{exp.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {profileData.education?.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <FiBookOpen className="w-5 h-5 mr-2" /> Education
                    </h3>
                    {profileData.education.map((edu, index) => (
                        <div key={index} className="border-l-4 border-green-500 pl-4 mb-4">
                            <h4 className="font-medium">{edu.degree}</h4>
                            <p className="text-gray-600">{edu.college}</p>
                            <p className="text-gray-500 text-sm">{edu.fieldOfStudy}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Activity</h3>
                {userPosts?.length > 0 ? (
                    userPosts.map((post) => (
                        <div key={post._id} className="border p-3 rounded-lg mb-3 shadow-sm">
                            <p className="text-gray-800">{post.description}</p>
                            <span className="text-gray-500 text-sm">
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
