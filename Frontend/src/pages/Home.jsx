import React, { useContext, useState } from 'react';
import Navbar from '../components/Navbar';
import EmptyProfile from '/EmptyProfile.svg';
import { UserDataContext } from '../context/UserContext';
import { FiPlus, FiCamera } from 'react-icons/fi';
import { MdOutlineEdit } from 'react-icons/md';
import EditProfile from '../components/EditProfile';
import PostPopup from '../components/PostPupUp';
import PublicFeed from '../components/PublicFeed';
import { useUser } from '../context/UserContext';

const Home = () => {
  const { userData, setUserData, edit, setEdit } = useUser();
  const [openPostPopup, setOpenPostPopup] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-start justify-center gap-[20px] bg-gray-100 px-[20px] pt-[90px] lg:flex-row">
      <Navbar />
      {edit && <EditProfile />}
      {openPostPopup && <PostPopup onClose={() => setOpenPostPopup(false)} />}

      <div className="relative min-h-[200px] w-full rounded-lg bg-white p-[10px] shadow-lg lg:w-[25%]">
        <div className="flex h-[100px] w-full items-center justify-center overflow-hidden rounded bg-gray-300">
          <img src={userData?.coverImage || ' '} alt="" />
          <div className="absolute top-[20px] right-[20px] w-[25px] cursor-pointer">
            <FiCamera />
          </div>
        </div>
        <div className="absolute top-[55px] left-[38px] h-[70px] w-[70px] items-center justify-center overflow-hidden rounded-full">
          <img
            src={userData?.profileImage || `${EmptyProfile}`}
            alt="Profile"
            className="h-full"
          />
        </div>
        <div className="absolute top-[85px] left-[65px] flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-full bg-white">
          <FiPlus />
        </div>
        <div className="mt-[15px] pl-[20px]">
          <div>
            {`${userData?.firstname}`} {`${userData?.lastname}`}
          </div>
          <div>{userData?.headLine || ''}</div>
          <div className="text-gray-400">{userData?.location}</div>
        </div>
        <button
          className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-full border py-2 font-semibold text-blue-600 hover:bg-blue-50"
          onClick={() => {
            setEdit(true);
          }}
        >
          Edit Profile <MdOutlineEdit />
        </button>
      </div>

      <div className="flex min-h-[200px] w-full flex-col gap-4 lg:w-[50%]">
        <div className="flex h-[120px] w-full items-center justify-center gap-2 rounded-lg bg-white px-2 shadow-lg">
          <div className="flex h-[70px] w-[70px] items-center justify-center overflow-hidden rounded-full">
            <img
              src={userData?.profileImage || `${EmptyProfile}`}
              alt="Profile"
              className="h-full"
            />
          </div>
          <button
            className="flex h-[60px] w-[80%] items-center justify-start rounded-full border-2 border-gray-500 px-4 hover:bg-gray-200"
            onClick={() => setOpenPostPopup(true)}
          >
            Start a post
          </button>
        </div>
        <PublicFeed />
      </div>

      <div className="min-h-[200px] w-full bg-white shadow-lg lg:w-[25%]"></div>
    </div>
  );
};

export default Home;
