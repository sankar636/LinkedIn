import React, { useContext, useState, useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import { useUser } from "../context/UserContext";
import { FaImage } from "react-icons/fa6";
import { usePosts } from "../context/PostContext"; // Import usePosts
import { UploadImage } from "../Utils/UploadImage";

const PostPopup = ({ onClose }) => {
  const { userData } = useUser();
  const [content, setContent] = useState("");
  const [postImageFile, setPostImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("")
  const { createPost } = usePosts();
  const postImageRef = useRef(null)


  const handlePostFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setPostImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      postImageRef.current.value = null;
    }
  }  
  const removeImage = () => {
    setPostImageFile(null)
    setImagePreview("")
  }

  const handlePost = async () => {
    if (!content.trim()) return;
    const formdata = new FormData()
    formdata.append("description", content)

    if (postImageFile) {
      formdata.append("image", postImageFile)
    }
    try {
      await createPost(formdata);
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
            src={userData?.profileImage || "/EmptyProfile.svg"}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{`${userData?.firstname} ${userData?.lastname}`}</h3>
            <span className="text-sm text-gray-500">Post to Anyone</span>
          </div>
        </div>

        <textarea
          placeholder="What do you want to talk about?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[150px] border-none outline-none text-lg resize-none"
        />

        {imagePreview && (
          <div className="my-2 relative">
            <img src={imagePreview} alt="Post preview" className="w-full rounded-lg" />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
            >
              <RxCross2 size={18} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <input
            type="file"
            ref={postImageRef}
            onChange={handlePostFileChange}
            className="hidden"
            accept="image/*"
          />
          <div
            className="flex items-center gap-2 text-gray-500 border rounded-full px-3 py-1 hover:bg-gray-100 cursor-pointer"
            onClick={() => postImageRef.current.click()}
          >
            <FaImage />
            <span>Add Image</span>
          </div>

          <button
            onClick={handlePost}
            className={`px-5 py-2 rounded-full text-white font-semibold transition-colors ${content.trim() || postImageFile
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
              }`}
            disabled={!content.trim() && !postImageFile}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPopup;
