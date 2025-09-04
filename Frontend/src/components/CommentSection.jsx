import { useEffect, useState } from "react";
import axios from "axios";
import EmptyProfile from "/EmptyProfile.svg";
import { MdDelete } from "react-icons/md";
import { usePosts } from "../context/PostContext";

const CommentSection = ({ post, userData }) => {
  const [commentInputs, setCommentInputs] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addComment, deleteComment, fetchComments } = usePosts()

  const handleAddComment = async () => {
    if (!commentInputs.trim()) return;

    setIsLoading(true);
    try {
      await addComment(post._id, commentInputs);
      setCommentInputs("");
    } catch (err) {
      console.error("Error adding comment:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId, post._id)

    } catch (err) {
      console.error("Error deleting comment:", err.response?.data?.message || err.message);
    }
  };

  
  useEffect(() => {
    // if(!post.comments || !post.comments.length === 0){
    //   fetchComments(post._id)
    // }
    fetchComments(post._id)
  }, [post._id])

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
      <div className="flex items-center gap-2 mb-3">
        <img
          src={userData?.profilePic || EmptyProfile}
          alt="Me"
          className="w-8 h-8 rounded-full object-cover"
        />
        <input
          type="text"
          placeholder="Write a comment..."
          className="w-full border border-gray-300 rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          onChange={(e) => setCommentInputs(e.target.value)}
          onKeyPress={handleKeyPress}
          value={commentInputs}
          disabled={isLoading}
        />
        <button
          onClick={handleAddComment}
          disabled={isLoading || !commentInputs.trim()}
          className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "..." : "Post"}
        </button>
      </div>

      {/* Comments List */}
      {post.comments && post.comments.length > 0 && (
        <ul className="space-y-2 text-sm text-gray-700">
          {post.comments.map((comment, index) => (
            <li
              key={index}
              className="bg-gray-100 p-2 rounded-md flex justify-between items-center"
            >
              <div className="flex items-start gap-2 flex-1">
                <img
                  src={comment.user?.profilePic || EmptyProfile}
                  alt={comment.user?.firstname}
                  className="w-6 h-6 rounded-full object-cover mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {comment.user?.firstname} {comment.user?.lastname}
                  </p>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                </div>
              </div>
              {canDeleteComment(comment) && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-500 text-xs hover:text-red-700 ml-2"
                    title="Delete comment"
                  >
                    {/* Delete */}
                    <MdDelete
                      className="text-red-400 text-2xl cursor-pointer hover:text-red-600 transition-colors duration-200"
                    />
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