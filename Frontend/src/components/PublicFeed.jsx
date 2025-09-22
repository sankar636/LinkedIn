import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from 'react';

import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import PostItem from './PostItem';
const PublicFeed = () => {
  const { posts, loading, error, likePost, fetchPosts } = usePosts();
  const { userData, followUser } = useUser();
  const [openComments, setOpenComments] = useState(null);
  const [openMore, setOpenMore] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = useCallback(
    async (postId) => {
      try {
        await likePost(postId);
      } catch (err) {
        console.error('Error liking post:', err);
      }
    },
    [likePost],
  );

  const handleToggleComments = useCallback((postId) => {
    setOpenComments((prev) => (prev === postId ? null : postId));
  }, []);

  const handleToggleMore = useCallback((postId) => {
    setOpenMore((prev) => (prev === postId ? null : postId));
  }, []);

  const handleFollow = useCallback(
    async (userId) => {
      try {
        await followUser(userId);
        setOpenMore(null);
      } catch (err) {
        console.error('Error following user:', err);
      }
    },
    [followUser],
  );

  if (loading) {
    return (
      <div className="mt-6 w-full rounded-lg shadow-md md:p-4">
        <h2 className="mb-4 text-xl font-semibold">Public Feed</h2>
        <div className="py-8 text-center">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 w-full rounded-lg shadow-md md:p-4">
        <h2 className="mb-4 text-xl font-semibold">Public Feed</h2>
        <div className="py-8 text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full rounded-lg shadow-md md:p-4">
      <h2 className="mb-4 text-xl font-semibold">Public Feed</h2>

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
        <p className="py-8 text-center text-gray-500">No posts available.</p>
      )}
    </div>
  );
};

export default React.memo(PublicFeed);
