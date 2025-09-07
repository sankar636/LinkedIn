import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserProfile from "../components/UserProfile";

const UserProfilePage = () => {
    
    const { username } = useParams()

    return (
        <div className="bg-gray-100 min-h-screen w-full pt-[90px] flex flex-col items-center">
            <Navbar />
            <UserProfile username={username} />
        </div>
    );
};

export default UserProfilePage;
