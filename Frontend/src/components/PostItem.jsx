import React, { useEffect, useMemo, useState } from 'react';
import { BiLike, BiSolidLike, BiRepost } from 'react-icons/bi';
import { FaRegComment } from 'react-icons/fa';
import { LuSend } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import CommentSection from './CommentSection';
import EmptyProfile from '/EmptyProfile.svg';
// import { useConnections } from "../context/ConnectionContext";

const PostItem = React.memo(
  ({
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

    const handleSendRequest = async (userId) => {
      setError(null);
      try {
        await sendConnectionRequest(userId);
        onToggleMore(null);
      } catch (error) {
        setError('Failed to send connection request.');
        console.log('Error sending Connection request ', error);
      }
    };
    const handleAcceptRequest = async (userId) => {
      try {
        await acceptConnection(userId);
        onToggleMore(null);
      } catch (err) {
        setError('Failed to accept request.');
        console.error('Error accepting connection request:', err);
      }
    };
    function timeAgo(date) {
      const seconds = Math.floor((new Date() - new Date(date)) / 1000);
      let interval = Math.floor(seconds / 31536000);
      if (interval >= 1)
        return `${interval} year${interval > 1 ? 's' : ''} ago`;
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1)
        return `${interval} month${interval > 1 ? 's' : ''} ago`;
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) return `${interval} day${interval > 1 ? 's' : ''} ago`;
      interval = Math.floor(seconds / 3600);
      if (interval >= 1)
        return `${interval} hour${interval > 1 ? 's' : ''} ago`;
      interval = Math.floor(seconds / 60);
      if (interval >= 1)
        return `${interval} minute${interval > 1 ? 's' : ''} ago`;
      return 'a few seconds ago';
    }

    const author = post.author || {};
    const authorId = author._id || '';
    const authorUsername = author.username || '';
    const authorFirstname = author.firstname || 'Unknown';
    const authorLastname = author.lastname || 'User';
    const authorProfilePic = author.profileImage || EmptyProfile;

    const isFollowing = useMemo(
      () => userData.following?.includes(authorId),
      [userData.following, authorId],
    );

    const isOwnPost = useMemo(
      () => userData?._id === authorId,
      [userData?._id, authorId],
    );

    const profileLink = useMemo(
      () => (isOwnPost ? '/profile' : `/profile/${authorUsername}`),
      [isOwnPost, authorUsername],
    );
    const isPostLike = useMemo(
      () => post.likes?.includes(userData._id),
      [post.likes, userData?._id],
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
        return (
          <button disabled className="text-green-600">
            Connected
          </button>
        );
      }
      if (isPending) {
        return (
          <button disabled className="text-gray-500">
            Pending
          </button>
        );
      }
      if (isRequestReceived) {
        return (
          <button
            onClick={() => handleAcceptRequest(authorId)}
            className="cursor-pointer font-semibold text-blue-600"
          >
            Accept Request
          </button>
        );
      }
      return (
        <button
          onClick={() => handleSendRequest(authorId)}
          className="cursor-pointer"
        >
          Connect
        </button>
      );
    };

    return (
      <div className="mb-6 rounded-lg border-b border-gray-200 bg-white pb-4 shadow-sm">
        <div className="flex items-start justify-between">
          <Link
            to={profileLink}
            className="flex cursor-pointer items-center gap-3 p-4"
          >
            <img
              src={authorProfilePic}
              alt="Author"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {authorFirstname} {authorLastname}
              </p>
              <span className="text-xs text-gray-500">
                {timeAgo(post.createdAt)}
              </span>
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
          <p className="text-sm text-gray-800">{post.description}</p>
          {post?.hashtags?.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {post.hashtags.map((tag, index) => (
                <span key={index} className="text-sm text-blue-600">
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
              className="object-fit h-[250px] w-fit rounded-lg"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-600">
          <span>{post.likes?.length || 0} Likes</span>
          <span>
            {post.commentCount || post.comments?.length || 0} Comments
          </span>
        </div>

        <div className="mx-4 flex items-center justify-between border-t-2 text-sm text-gray-600">
          <button
            onClick={() => likePost(post._id)}
            className="flex w-full items-center justify-center gap-1 py-2 hover:bg-gray-100"
          >
            {isPostLike ? (
              <BiSolidLike className="text-lg text-blue-500" />
            ) : (
              <BiLike className="text-lg" />
            )}
            <span>Like</span>
          </button>

          <button
            className="flex w-full items-center justify-center gap-1 px-4 py-2 hover:bg-gray-100"
            onClick={() => onToggleComments(post._id)}
          >
            <FaRegComment className="text-lg" />
            <span>Comment</span>
          </button>

          <button className="flex w-full items-center justify-center gap-1 px-4 py-2 hover:bg-gray-100">
            <BiRepost className="text-lg" />
            <span>Repost</span>
          </button>

          <button className="flex w-full items-center justify-center gap-1 py-2 hover:bg-gray-100">
            <LuSend className="text-lg" />
            <span>Send</span>
          </button>
        </div>

        {openComments === post._id && (
          <CommentSection post={post} userData={userData} />
        )}
      </div>
    );
  },
);

PostItem.displayName = 'PostItem';
export default PostItem;
