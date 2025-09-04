import React, { useCallback, useMemo, useRef, useEffect, useState } from "react";

import { usePosts } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import PostItem from "./PostItem";
const PublicFeed = () => {
    const { posts, loading, error, likePost, fetchPosts } = usePosts();
    const { userData, followUser } = useUser();    
    const [openComments, setOpenComments] = React.useState(null);
    const [openMore, setOpenMore] = React.useState(null);

    // Fetch posts on mount
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // const sortedPosts = useMemo(() => 
    //     [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    //     [posts]
    // );

    // Memoized event handlers
    const handleLike = useCallback(async (postId) => {
        try {
            await likePost(postId);
        } catch (err) {
            console.error("Error liking post:", err);
        }
    }, [likePost]);

    const handleToggleComments = useCallback((postId) => {
        setOpenComments(prev => prev === postId ? null : postId);
    }, []);

    const handleToggleMore = useCallback((postId) => {
        setOpenMore(prev => prev === postId ? null : postId);
    }, []);

    const handleFollow = useCallback(async (userId) => {
        try {
            await followUser(userId);
            setOpenMore(null);
        } catch (err) {
            console.error("Error following user:", err);
        }
    }, [followUser]);

    if (loading) {
        return (
            <div className="w-full shadow-md rounded-lg md:p-4 mt-6">
                <h2 className="text-xl font-semibold mb-4">Public Feed</h2>
                <div className="text-center py-8">Loading posts...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full shadow-md rounded-lg md:p-4 mt-6">
                <h2 className="text-xl font-semibold mb-4">Public Feed</h2>
                <div className="text-center py-8 text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="w-full shadow-md rounded-lg md:p-4 mt-6">
            <h2 className="text-xl font-semibold mb-4">Public Feed</h2>
            
            {posts.length > 0 ? (
                posts.map((post) => (
                    <PostItem
                        key={post._id}
                        post={post}
                        likePost={handleLike}
                        onToggleComments={handleToggleComments}
                        onFollow={handleFollow}
                        onToggleMore={handleToggleMore}
                        openComments={openComments}
                        openMore={openMore}
                        userData={userData} 
                    />
                ))
            ) : (
                <p className="text-gray-500 text-center py-8">No posts available.</p>
            )}
        </div>
    );
};

export default React.memo(PublicFeed);
