import React, { useContext, useEffect } from "react";
import { PostContext } from "../context/PostContext";
import { AuthDataContext } from "../context/AuthContext";
import axios from "axios";
import EmptyProfile from "/EmptyProfile.svg";

const PublicFeed = () => {
    const { posts, setPosts } = useContext(PostContext);
    const { serverUrl } = useContext(AuthDataContext);

    // Fetch posts from backend
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${serverUrl}/post/all`);
                console.log(response.data);                
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

    return (
        <div className="w-full lg:w-[50%] bg-white shadow-md rounded-lg p-4 mt-6">
            <h2 className="text-xl font-semibold mb-4">Public Feed</h2>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div
                        key={post._id}
                        className="border-b border-gray-200 pb-4 mb-4 last:border-none last:mb-0"
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
                                    {new Date(post.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Post Content */}
                        <p className="text-gray-800">{post.description}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No posts available.</p>
            )}
        </div>
    );
};

export default PublicFeed;
