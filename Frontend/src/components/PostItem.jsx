import React, { useEffect, useMemo, useState } from "react";
import { BiLike, BiSolidLike, BiRepost } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { Link } from "react-router-dom";
import CommentSection from "./CommentSection";
import EmptyProfile from "/EmptyProfile.svg";
// import { useConnections } from "../context/ConnectionContext";

const PostItem = React.memo(({
    post,
    likePost,
    onToggleComments,
    onFollow,
    onToggleMore,
    openComments,
    openMore,
    userData,
}) => {
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null); 
    }, [post]);

    const handleSendRequest = async(userId) => {
        setError(null);
        try {
            await sendConnectionRequest(userId);
            onToggleMore(null)
        } catch (error) {
            setError("Failed to send connection request.");
            console.log("Error sending Connection request ", error);
        }
    }
    const handleAcceptRequest = async (userId) => {
        try {
            await acceptConnection(userId);
            onToggleMore(null); 
        } catch (err) {
            setError("Failed to accept request.");
            console.error("Error accepting connection request:", err);
        }
    };
    function timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return `${interval} year${interval > 1 ? "s" : ""} ago`;
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return `${interval} month${interval > 1 ? "s" : ""} ago`;
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return `${interval} day${interval > 1 ? "s" : ""} ago`;
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return `${interval} hour${interval > 1 ? "s" : ""} ago`;
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return `${interval} minute${interval > 1 ? "s" : ""} ago`;
        return "a few seconds ago";
    }

    const author = post.author || {};
    const authorId = author._id || '';
    const authorUsername = author.username || '';
    const authorFirstname = author.firstname || 'Unknown';
    const authorLastname = author.lastname || 'User';
    const authorProfilePic = author.profilePic || EmptyProfile;
    
    const isFollowing = useMemo(() =>
        userData.following?.includes(authorId),
        [userData.following, authorId]
    );
    
    const isOwnPost = useMemo(() =>
        userData?._id === authorId,
        [userData?._id, authorId]
    );

    const profileLink = useMemo(() =>
        isOwnPost ? "/profile" : `/profile/${authorUsername}`,
        [isOwnPost, authorUsername]
    );    
    const isPostLike = useMemo(() => 
        post.likes?.includes(userData._id),
        [post.likes, userData?._id]
    );

    // Connection status logic
    // const isConnected = useMemo(() =>
    //     connections.some(conn => conn.id === authorId),
    //     [connections, authorId]
    // );
    // const isPending = useMemo(() =>
    //     outgoingRequests.includes(authorId),
    //     [outgoingRequests, authorId]
    // );
    // const isRequestReceived = useMemo(() =>
    //     connectionRequests.some(req => req.id === authorId),
    //     [connectionRequests, authorId]
    // );

    const renderConnectionButton = () => {
        if (isConnected) {
            return <button disabled className="text-green-600">Connected</button>;
        }
        if (isPending) {
            return <button disabled className="text-gray-500">Pending</button>;
        }
        if (isRequestReceived) {
            return <button onClick={() => handleAcceptRequest(authorId)} className="cursor-pointer font-semibold text-blue-600">Accept Request</button>;
        }
        return <button onClick={() => handleSendRequest(authorId)} className="cursor-pointer">Connect</button>;
    };

    return (
        <div className="border-b border-gray-200 pb-4 mb-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-start justify-between">
                <Link to={profileLink} className="flex items-center gap-3 p-4 cursor-pointer">
                    <img
                        src={authorProfilePic}
                        alt="Author"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-semibold text-gray-800">
                            {authorFirstname} {authorLastname}
                        </p>
                        <span className="text-gray-500 text-xs">{timeAgo(post.createdAt)}</span>
                    </div>
                </Link>

                {/* {!isOwnPost && (
                    <div className="px-4 font-bold text-2xl text-gray-400 h-full">
                        <span className="cursor-pointer relative" onClick={() => onToggleMore(post._id)}>
                            ...
                            {openMore === post._id && (
                                <div
                                    className="absolute top-10 right-0 bg-white shadow-2xl p-4 text-black font-medium flex flex-col items-start gap-3 text-sm rounded-md z-10"
                                    onMouseLeave={() => onToggleMore(null)}
                                >
                                    {renderConnectionButton()}
                                    <button
                                        className={`${isFollowing ? "text-gray-500" : ""}`}
                                        onClick={() => onFollow(authorId)}
                                        disabled={isFollowing}
                                    >
                                        {isFollowing ? "Following" : "Follow"}
                                    </button>
                                </div>
                            )}
                        </span>
                    </div>
                )} */}
            </div>

            <div className="px-4">
                <p className="text-gray-800 text-sm">{post.description}</p>
                {post?.hashtags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {post.hashtags.map((tag, index) => (
                            <span key={index} className="text-blue-600 text-sm">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {post?.image && (
                <div className="mt-3">
                    <img
                        src={post.image}
                        alt="Post"
                        className="w-full rounded-lg object-cover"
                        loading="lazy"
                    />
                </div>
            )}

            <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-600">
                <span>{post.likes?.length || 0} Likes</span>
                <span>{post.commentCount || post.comments?.length || 0} Comments</span>
            </div>

            <div className="border-t-2 mx-4 flex items-center justify-between text-gray-600 text-sm">
                <button
                    onClick={() => likePost(post._id)}
                    className="flex items-center gap-1 py-2 hover:bg-gray-100 w-full justify-center"
                >
                    {isPostLike ? (
                        <BiSolidLike className="text-blue-500 text-lg" />
                    ) : (
                        <BiLike className="text-lg" />
                    )}
                    <span>Like</span>
                </button>

                <button
                    className="flex items-center gap-1 py-2 px-4 hover:bg-gray-100 w-full justify-center"
                    onClick={() => onToggleComments(post._id)}
                >
                    <FaRegComment className="text-lg" />
                    <span>Comment</span>
                </button>

                <button className="flex items-center gap-1 py-2 px-4 hover:bg-gray-100 w-full justify-center">
                    <BiRepost className="text-lg" />
                    <span>Repost</span>
                </button>

                <button className="flex items-center gap-1 py-2 hover:bg-gray-100 w-full justify-center">
                    <LuSend className="text-lg" />
                    <span>Send</span>
                </button>
            </div>

            {openComments === post._id && (
                <CommentSection
                    post={post}
                    userData={userData}
                />
            )}
        </div>
    );
});

PostItem.displayName = 'PostItem';
export default PostItem;
