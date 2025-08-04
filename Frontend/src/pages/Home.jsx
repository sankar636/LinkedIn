import React, { useContext, useState } from 'react'
import Navbar from '../components/Navbar'
import EmptyProfile from '/EmptyProfile.svg'
import { UserDataContext } from '../context/UserContext'
import { FiPlus, FiCamera } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";
import EditProfile from '../components/EditProfile';
import PostPopup from '../components/PostPupUp';
import PublicFeed from '../components/PublicFeed'; 

const Home = () => {
  const { userData, setUserData, edit, setEdit } = useContext(UserDataContext)
  const [openPostPopup, setOpenPostPopup] = useState(false);

  return (
    <div className='bg-gray-100 min-h-screen w-full pt-[90px] flex items-start justify-center gap-[20px] px-[20px] flex-col lg:flex-row relative'>
      <Navbar />
      {edit && <EditProfile />}
      {openPostPopup && <PostPopup onClose={() => setOpenPostPopup(false)} />}

      <div className='w-full lg:w-[25%] min-h-[200px] bg-white shadow-lg rounded-lg p-[10px] relative'>
        <div className='w-full h-[100px] bg-gray-300 rounded overflow-hidden flex items-center justify-center'>
          <img src={userData?.coverImage || " "} alt="" />
          <div className='absolute right-[20px] top-[20px] w-[25px] cursor-pointer'>
            <FiCamera />
          </div>
        </div>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden items-center justify-center absolute top-[55px] left-[38px]'>
          <img
            src={userData?.profilePic || `${EmptyProfile}`}
            alt="Profile"
            className="h-full"
          />
        </div>
        <div className='w-[20px] h-[20px] bg-white rounded-full absolute top-[85px] left-[65px] justify-center items-center flex cursor-pointer'>
          <FiPlus />
        </div>
        <div className='mt-[15px] pl-[20px]'>
          <div>{`${userData?.firstname}`} {`${userData?.lastname}`}</div>
          <div>{userData?.headLine || ""}</div>
          <div className='text-gray-400'>{userData?.location}</div>
        </div>
        <button className="w-full mt-3 py-2 border rounded-full text-blue-600 font-semibold hover:bg-blue-50 flex items-center justify-center gap-2.5"
          onClick={() => { setEdit(true) }}
        >
          Edit Profile <MdOutlineEdit />
        </button>
      </div>

      <div className="w-full lg:w-[50%] min-h-[200px] flex flex-col gap-4">
        <div className="w-full h-[120px] bg-white shadow-lg rounded-lg flex items-center justify-center px-2 gap-2">
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center">
            <img
              src={userData?.profilePic || `${EmptyProfile}`}
              alt="Profile"
              className="h-full"
            />
          </div>
          <button
            className="w-[80%] h-[60px] border-2 rounded-full border-gray-500 flex items-center justify-start hover:bg-gray-200 px-4"
            onClick={() => setOpenPostPopup(true)}
          >
            Start a post
          </button>
        </div>
        <PublicFeed />
      </div>

      <div className='w-full lg:w-[25%] min-h-[200px] bg-white shadow-lg'></div>
    </div>
  )
}

export default Home
