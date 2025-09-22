import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import UserProfile from '../components/UserProfile';

const UserProfilePage = () => {
  const { username } = useParams();

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 pt-[90px]">
      <Navbar />
      <UserProfile username={username} />
    </div>
  );
};

export default UserProfilePage;
