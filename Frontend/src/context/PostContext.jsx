import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthDataContext } from "./AuthContext";

export const PostContext = createContext();

const PostProvider = ({ children }) => {
  const { serverUrl } = useContext(AuthDataContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/post/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(response.data);
      
      setPosts(response.data.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new post
  const createPost = async (content) => {
    try {
      const response = await axios.post(
        `${serverUrl}/post/create`,
        { description: content },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );      
      setPosts((prev) => [response.data.data.post, ...prev]); // Add new post to top
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider value={{ posts,setPosts, loading, fetchPosts, createPost }}>
      {children}
    </PostContext.Provider>
  );
};

export default PostProvider
