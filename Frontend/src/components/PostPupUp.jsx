import React, { useContext, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useUser } from "../context/UserContext";
import { FaImage } from "react-icons/fa6";
import { usePosts } from "../context/PostContext"; // Import usePosts

const PostPopup = ({ onClose }) => {
  const { userData } = useUser();
  const [content, setContent] = useState("");
  const { createPost } = usePosts(); // Use createPost from context

  const handlePost = async () => {
    if (!content.trim()) return;

    try {
      await createPost(content); // Use context method
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white w-[90%] max-w-[500px] rounded-lg shadow-lg p-4 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <RxCross2 size={24} />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <img
            src={userData?.profilePic || "/EmptyProfile.svg"}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold">{userData?.firstname} {userData?.lastname}</h3>
            <span className="text-sm text-gray-500">Post to Anyone</span>
          </div>
        </div>
        <textarea
          placeholder="What do you want to talk about?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[250px] border-none outline-none text-lg resize-none"
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3 text-gray-500 border rounded-full px-2 hover:bg-gray-100 cursor-pointer">
            <FaImage />
            <button className="py-1 cursor-pointer">
              Add Image
            </button>
          </div>
          <button
            onClick={handlePost}
            className={`px-5 py-2 rounded-full text-white font-semibold ${content.trim()
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
              }`}
            disabled={!content.trim()}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPopup;
