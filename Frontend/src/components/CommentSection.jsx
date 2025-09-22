import { useEffect, useState } from 'react';
import axios from 'axios';
import EmptyProfile from '/EmptyProfile.svg';
import { MdDelete } from 'react-icons/md';
import { usePosts } from '../context/PostContext';

const CommentSection = ({ post, userData }) => {
  const [commentInputs, setCommentInputs] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addComment, deleteComment, fetchComments } = usePosts();

  const handleAddComment = async () => {
    if (!commentInputs.trim()) return;

    setIsLoading(true);
    try {
      await addComment(post._id, commentInputs);
      setCommentInputs('');
    } catch (err) {
      console.error('Error adding comment:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId, post._id);
    } catch (err) {
      console.error(
        'Error deleting comment:',
        err.response?.data?.message || err.message,
      );
    }
  };

  useEffect(() => {
    // if(!post.comments || !post.comments.length === 0){
    //   fetchComments(post._id)
    // }
    fetchComments(post._id);
  }, [post._id]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  // Check if the current user can delete a comment
  const canDeleteComment = (comment) => {
    return (
      String(comment.user?._id) === String(userData?._id) || // comment author
      String(post.author?._id || post.author) === String(userData?._id) // post author
    );
  };

  return (
    <div className="px-4 py-3">
      <div className="mb-3 flex items-center gap-2">
        <img
          src={userData?.profileImage || EmptyProfile}
          alt="Me"
          className="h-8 w-8 rounded-full object-cover"
        />
        <input
          type="text"
          placeholder="Write a comment..."
          className="w-full rounded-full border border-gray-300 px-4 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
          onChange={(e) => setCommentInputs(e.target.value)}
          onKeyPress={handleKeyPress}
          value={commentInputs}
          disabled={isLoading}
        />
        <button
          onClick={handleAddComment}
          disabled={isLoading || !commentInputs.trim()}
          className="rounded-full bg-blue-500 px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading ? '...' : 'Post'}
        </button>
      </div>

      {/* Comments List */}
      {post.comments && post.comments.length > 0 && (
        <ul className="space-y-2 text-sm text-gray-700">
          {post.comments.map((comment, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-md bg-gray-100 p-2"
            >
              <div className="flex flex-1 items-start gap-2">
                <img
                  src={comment.user?.profileImage || EmptyProfile}
                  alt={comment.user?.firstname}
                  className="mt-1 h-6 w-6 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {comment.user?.firstname} {comment.user?.lastname}
                  </p>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
              {canDeleteComment(comment) && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="ml-2 text-xs text-red-500 hover:text-red-700"
                  title="Delete comment"
                >
                  {/* Delete */}
                  <MdDelete className="cursor-pointer text-2xl text-red-400 transition-colors duration-200 hover:text-red-600" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentSection;
