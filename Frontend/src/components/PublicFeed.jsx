import React, { useContext, useEffect } from "react";
import { PostContext } from "../context/PostContext";
import { BiLike, BiSolidLike } from "react-icons/bi";   
import { AuthDataContext } from "../context/AuthContext";
import axios from "axios";
import EmptyProfile from "/EmptyProfile.svg";
import UserContext, { UserDataContext } from "../context/UserContext";

const PublicFeed = () => {
    const { posts, setPosts } = useContext(PostContext);
    const { serverUrl } = useContext(AuthDataContext);
    const { userData } = useContext(UserDataContext);
    console.log(userData);
    // Fetch posts from backend
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${serverUrl}/post/all`);
                // console.log(response.data);                
                const sortedPosts = response.data.data.posts.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                console.log(sortedPosts);
                setPosts(sortedPosts);
            } catch (error) {
                // console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, [serverUrl, setPosts]);

    const handleLike = async (postId) => {
        console.log(postId);

        try {
            console.log(serverUrl);

            const token = localStorage.getItem("token"); // or from redux state
            const response = await axios.post(`${serverUrl}/post/${postId}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Response", response);

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
                        className="border-b border-gray-200 pb-4 mb-4 last:border-none last:mb-0 flex flex-col gap-2 bg-white p-4"
                    >
                        {/* Author Info */}
                        <div className="flex items-center gap-3 mb-2">
                            <img
                                src={post.author?.profilePic || EmptyProfile}
                                alt="Author"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold">
                                    {post.author?.firstname} {post.author?.lastname}
                                </p>
                                <span className="text-gray-500 text-sm">
                                    {/* {new Date(post.createdAt).fromNow().toLocaleString()} */}
                                    {timeAgo(post.createdAt)}
                                </span>
                            </div>
                        </div>

                        {/* Post Content */}
                        <div>
                            <p className="text-gray-800">{post.description}</p>
                            <div>{post?.hashtags}</div>
                        </div>

                        <div>
                            <img src={`${post?.image}` || ""} alt="" />
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <button
                                onClick={() => handleLike(post._id)}
                                className="px-3 py-1 rounded flex items-center space-x-1"
                            >
                                {post.likes.includes(userData?._id) ? (
                                    <BiSolidLike className="text-blue-500 text-xl cursor-pointer" />
                                ) : (
                                    <BiLike className="text-gray-400 text-xl cursor-pointer" />
                                )}
                                <span>{post.likes.length}</span>
                            </button>
                            <button className=" cursor-pointer">
                                Comments <span>{post.comments.length}</span>
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No posts available.</p>
            )}
        </div>
    );
};

export default PublicFeed;
