import React, { useContext, useEffect, useState } from "react";
import { PostContext } from "../context/PostContext";
import { BiLike, BiSolidLike, BiRepost } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { AuthDataContext } from "../context/AuthContext";
import axios from "axios";
import EmptyProfile from "/EmptyProfile.svg";
import { UserDataContext } from "../context/UserContext";
import CommentSection from "./CommentSection";

const PublicFeed = () => {
    const { posts, setPosts } = useContext(PostContext);
    const { serverUrl } = useContext(AuthDataContext);
    const { userData } = useContext(UserDataContext);

    const [openComments, setOpenComments] = useState(null);

    // console.log("Posts", posts);

    // Fetch posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${serverUrl}/post/all`);
                const sortedPosts = response.data.data.posts.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setPosts(sortedPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, [serverUrl, setPosts]);

    const handleLike = async (postId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${serverUrl}/post/${postId}/like`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPosts((prev) =>
                prev.map((post) =>
                    post._id === postId
                        ? {
                            ...post,
                            likes: post.likes.includes(userData._id)
                                ? post.likes.filter((id) => id !== userData._id)
                                : [...post.likes, userData._id],
                        }
                        : post
                )
            );
        } catch (err) {
            console.error("Error liking post:", err);
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

    return (
        <div className="w-full shadow-md rounded-lg md:p-4 mt-6">
            <h2 className="text-xl font-semibold mb-4">Public Feed</h2>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div
                        key={post._id}
                        className="border-b border-gray-200 pb-4 mb-6 bg-white rounded-lg shadow-sm"
                    >
                        {/* Author Info */}
                        <div className="flex items-center gap-3 p-4">
                            <img
                                src={post.author?.profilePic || EmptyProfile}
                                alt="Author"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-gray-800">
                                    {post.author?.firstname} {post.author?.lastname}
                                </p>
                                <span className="text-gray-500 text-xs">
                                    {timeAgo(post.createdAt)}
                                </span>
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="px-4">
                            <p className="text-gray-800 text-sm">{post.description}</p>
                            {post?.hashtags && post.hashtags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {post.hashtags.map((tag, index) => (
                                        <span key={index} className="text-blue-600 text-sm">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Post Image */}
                        {post?.image && (
                            <div className="mt-3">
                                <img
                                    src={post.image}
                                    alt="Post"
                                    className="w-full rounded-lg object-cover"
                                />
                            </div>
                        )}

                        {/* Likes + Comments Count */}
                        <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-600">
                            <span>{post.likes.length} Likes</span>
                            <span>{post.commentCount || post.comments?.length || 0} Comments</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="border-t-2 mx-4 flex items-center justify-between text-gray-600 text-sm">
                            <button
                                onClick={() => handleLike(post._id)}
                                className="flex items-center gap-1 py-2 hover:bg-gray-100 w-full justify-center"
                            >
                                {post.likes.includes(userData?._id) ? (
                                    <BiSolidLike className="text-blue-500 text-lg" />
                                ) : (
                                    <BiLike className="text-lg" />
                                )}
                                <span>Like</span>
                            </button>

                            <button
                                className="flex items-center gap-1 py-2 px-4 hover:bg-gray-100 w-full justify-center"
                                onClick={() =>
                                    setOpenComments(openComments === post._id ? null : post._id)
                                }
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

                        {/* Comment Section */}
                        {openComments === post._id && (
                            <CommentSection
                                post={post}
                                serverUrl={serverUrl}
                                token={localStorage.getItem("token")}
                                userData={userData}
                                setPosts={setPosts}
                            />
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No posts available.</p>
            )}
        </div>
    );
};

export default PublicFeed;