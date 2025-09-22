import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiBriefcase, FiBookOpen, FiCamera, FiPlus } from 'react-icons/fi';
import EmptyProfile from '/EmptyProfile.svg';
import { MdOutlineEdit } from 'react-icons/md';
import { UserDataContext } from '../context/UserContext';
import { PostContext } from '../context/PostContext';
import { AuthDataContext } from '../context/AuthContext';
import { UploadImage } from '../Utils/UploadImage';

const Profile = () => {
  const { userData, setEdit } = useContext(UserDataContext);
  const { posts } = useContext(PostContext);
  const { serverUrl } = useContext(AuthDataContext);
  const navigate = useNavigate();

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleProfileFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const response = await UploadImage({
        file: file,
        uploadUrl: `${serverUrl}/user/profileImage`,
        fieldName: 'profileImage',
        token: localStorage.getItem('token'),
      });
    } catch (error) {}
  };

  const handleCoverFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const response = await UploadImage({
        file: file,
        uploadUrl: `${serverUrl}/user/coverImage`,
        fieldName: 'coverImage',
        token: localStorage.getItem('token'),
      });
    } catch (error) {}
  };

  if (!userData) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  // Filter posts of the current user
  const userPosts = posts.filter((post) => post.author?._id === userData._id);
  // console.log(userPosts);

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 pt-[90px]">
      <Navbar />
      <input
        type="file"
        ref={profileInputRef}
        onChange={handleProfileFileChange}
        className="hidden"
        accept="image/*"
      />
      <input
        type="file"
        ref={coverInputRef}
        onChange={handleCoverFileChange}
        className="hidden"
        accept="image/*"
      />
      <div className="my-4 w-full max-w-4xl rounded-lg bg-white p-6 shadow-md">
        <div className="relative">
          <div className="h-[150px] w-full overflow-hidden rounded bg-gray-300">
            <img
              src={userData.coverImage || ' '}
              alt="Cover"
              className="h-full w-full object-cover"
            />
          </div>
          <div
            className="absolute top-[20px] right-[20px] w-[25px] cursor-pointer hover:text-xl"
            onClick={() => coverInputRef.current.click()}
          >
            <FiCamera />
          </div>
          <div className="absolute top-[100px] left-[30px] h-[100px] w-[100px] overflow-hidden rounded-full border-4 border-white shadow-md">
            <img
              src={userData.profileImage || EmptyProfile}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div
            className="absolute left-[65px] flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-full bg-red-500 hover:text-2xl"
            onClick={() => profileInputRef.current.click()}
          >
            <FiPlus className="transition-transform duration-500 ease-in-out hover:rotate-[360deg]" />
          </div>
        </div>
        <div className="mt-16 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {userData.firstname} {userData.lastname}
            </h2>
            <p className="text-gray-600">
              {userData.headLine || 'No headline provided'}
            </p>
            <p className="text-gray-400">
              {userData.location || 'Location not specified'}
            </p>
          </div>
          {userData.education?.length > 0 && (
            <div className="border-l-4 border-red-500 pl-4">
              <p className="text-gray-600">{userData.education[0].college}</p>
              <h4 className="font-medium">{userData.education[0].degree}</h4>
            </div>
          )}
        </div>
        <button
          className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border py-2 font-semibold text-blue-600 hover:bg-blue-50"
          onClick={() => {
            navigate('/');
            setEdit(true);
          }}
        >
          Edit Profile <MdOutlineEdit />
        </button>
        {userData.skills?.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 text-lg font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {userData.experience?.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 flex items-center text-lg font-semibold">
              <FiBriefcase className="mr-2 h-5 w-5" /> Experience
            </h3>
            {userData.experience.map((exp, index) => (
              <div key={index} className="mb-4 border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium">{exp.title}</h4>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.description}</p>
              </div>
            ))}
          </div>
        )}
        {userData.education?.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 flex items-center text-lg font-semibold">
              <FiBookOpen className="mr-2 h-5 w-5" /> Education
            </h3>
            {userData.education.map((edu, index) => (
              <div
                key={index}
                className="mb-4 border-l-4 border-green-500 pl-4"
              >
                <h4 className="font-medium">{edu.degree}</h4>
                <p className="text-gray-600">{edu.college}</p>
                <p className="text-sm text-gray-500">{edu.fieldOfStudy}</p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <h4 className="font-semibold">Location</h4>
            <p>{userData.location || 'Not specified'}</p>
          </div>
          <div>
            <h4 className="font-semibold">Gender</h4>
            <p>{userData.gender || 'Not specified'}</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold">Activity</h3>
          {userPosts.length > 0 ? (
            userPosts.map((post, index) => (
              <div key={index} className="mb-3 rounded-lg border p-3 shadow-sm">
                <p className="text-gray-800">{post.description}</p>
                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
