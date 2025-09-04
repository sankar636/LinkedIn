import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from "react";
import axios from "axios";
import { AuthDataContext } from "./AuthContext";

export const PostContext = createContext();

// Custom hook for easier consumption
export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

const PostProvider = ({ children }) => {
  const { serverUrl } = useContext(AuthDataContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [likingPostId, setLikingPostId] = useState(null);

  // Helper to get token
  const getToken = useCallback(() => localStorage.getItem("token"), []);

  // Fetch all posts
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();

      const response = await axios.get(`${serverUrl}/post/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(response.data.data.posts);

    } catch (error) {
      // console.error("Error fetching posts:", error);
      setError(error.response?.data?.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [serverUrl, getToken]);
  // Create a new post
  const createPost = useCallback(async (content) => {
    try {
      setError(null);
      const token = getToken();

      const response = await axios.post(
        `${serverUrl}/post/create`,
        { description: content },
        { headers: { Authorization: `Bearer ${token}` } }
      );      
      setPosts((prev) => [response.data.data, ...prev]);
      return response.data.data.post; // Return the created post for immediate use
    } catch (error) {
      // console.error("Error creating post:", error);
      setError(error.response?.data?.message || "Failed to create post");
      throw error; // Re-throw for component-level handling
    }
  }, [serverUrl, getToken]);

  // Update a post
  const updatePost = useCallback(async (postId, updates) => {
    try {
      setError(null);
      const token = getToken();

      const response = await axios.put(
        `${serverUrl}/post/update/${postId}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts(prev => prev.map(post =>
        post._id === postId ? response.data.data.post : post
      ));

      return response.data.data.post;
    } catch (error) {
      console.error("Error updating post:", error);
      setError(error.response?.data?.message || "Failed to update post");
      throw error;
    }
  }, [serverUrl, getToken]);

  // Delete a post
  const deletePost = useCallback(async (postId) => {
    try {
      setError(null);
      const token = getToken();

      await axios.delete(
        `${serverUrl}/post/delete/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts(prev => prev.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      setError(error.response?.data?.message || "Failed to delete post");
      throw error;
    }
  }, [serverUrl, getToken]);

  // Like a post
  const likePost = useCallback(async (postId) => {
    setLikingPostId(postId);
    try {
      const token = getToken();

      const response = await axios.post(
        `${serverUrl}/post/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedPost = response.data.data.updatedPost;
      
      if (updatedPost) {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post._id === postId ? updatedPost : post
            )
        );
      }


      return updatedPost;
    } catch (error) {
      // console.error("Error liking post:", error);
      setError(error.response?.data?.message || "Failed to like post");
      throw error;
    } finally {
      setLikingPostId(null);
    }
  }, [serverUrl, getToken]);

  const addComment = useCallback(async (postId, content) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${serverUrl}/comments`,
        { postId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newComment = response.data.data.comment;
      setPosts(prev => prev.map(post =>
        post._id === postId
          ? {
            ...post,
            comments: [...(post.comments || []), newComment],
            commentCount: (post.commentCount || 0) + 1
          }
          : post
      ));

      return newComment;
    } catch (error) {
      // console.error("Error adding comment:", error);
      setError(error.response?.data?.message || "Failed to add comment");
      throw error;
    }
  }, [serverUrl, getToken]);

  const deleteComment = useCallback(async (commentId, postId) => {
    try {
      const token = getToken();
      const res = await axios.delete(
        `${serverUrl}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(prev => prev.map(post =>
        post._id === postId
          ? {
            ...post,
            comments: post.comments.filter(c => c._id !== commentId),
            commentCount: (post.commentCount || 1) - 1
          }
          : post
      ));
    } catch (error) {
      // console.error("Error deleting comment:", error);
      setError(error.response?.data?.message || "Failed to delete comment");
      throw error;
    }
  }, [serverUrl, getToken]);

   const fetchComments = useCallback(async (postId) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${serverUrl}/comments/post/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const comments = response.data.data.comments || [];
      setPosts(prev => prev.map(post =>
        post._id === postId ? { ...post, comments } : post
      ));
      
      return comments;
    } catch (error) {
      // console.error("Error fetching comments:", error);
      setError(error.response?.data?.message || "Failed to fetch comments");
      throw error;
    }
   }, [serverUrl, getToken]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch posts on mount and when serverUrl changes
  useEffect(() => {
    const token = getToken();
    if (token && serverUrl) {
      fetchPosts();
    }
  }, [serverUrl, getToken, fetchPosts]);

  const contextValue = useMemo(() => ({
    posts,
    setPosts,
    loading,
    error,
    likingPostId,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
    deleteComment,
    fetchComments,
    clearError
  }), [
    posts,
    loading,
    error,
    likingPostId,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
    deleteComment,
    fetchComments,
    clearError
  ]);

  return (
    <PostContext.Provider value={contextValue}>
      {children}
    </PostContext.Provider>
  );
};

export default PostProvider;