import React, { useContext, useState, useRef } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useUser } from '../context/UserContext';
import { FaImage } from 'react-icons/fa6';
import { usePosts } from '../context/PostContext'; // Import usePosts
import { UploadImage } from '../Utils/UploadImage';

const PostPopup = ({ onClose }) => {
  const { userData } = useUser();
  const [content, setContent] = useState('');
  const [postImageFile, setPostImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const { createPost } = usePosts();
  const postImageRef = useRef(null);

  const handlePostFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      postImageRef.current.value = null;
    }
  };
  const removeImage = () => {
    setPostImageFile(null);
    setImagePreview('');
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    const formdata = new FormData();
    formdata.append('description', content);

    if (postImageFile) {
      formdata.append('image', postImageFile);
    }
    try {
      await createPost(formdata);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  return (
    <div className="bg-opacity-50 fixed inset-0 z-[100] flex items-center justify-center bg-black">
      <div className="relative w-[90%] max-w-[500px] rounded-lg bg-white p-4 shadow-lg">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <RxCross2 size={24} />
        </button>
        <div className="mb-4 flex items-center gap-3">
          <img
            src={userData?.profileImage || '/EmptyProfile.svg'}
            alt="Profile"
            className="h-12 w-12 rounded-full object-cover"
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
          className="min-h-[150px] w-full resize-none border-none text-lg outline-none"
        />

        {imagePreview && (
          <div className="relative my-2">
            <img
              src={imagePreview}
              alt="Post preview"
              className="w-full rounded-lg"
            />
            <button
              onClick={removeImage}
              className="bg-opacity-50 hover:bg-opacity-75 absolute top-2 right-2 rounded-full bg-gray-800 p-1 text-white"
            >
              <RxCross2 size={18} />
            </button>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <input
            type="file"
            ref={postImageRef}
            onChange={handlePostFileChange}
            className="hidden"
            accept="image/*"
          />
          <div
            className="flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-gray-500 hover:bg-gray-100"
            onClick={() => postImageRef.current.click()}
          >
            <FaImage />
            <span>Add Image</span>
          </div>

          <button
            onClick={handlePost}
            className={`rounded-full px-5 py-2 font-semibold text-white transition-colors ${
              content.trim() || postImageFile
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'cursor-not-allowed bg-gray-300'
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
