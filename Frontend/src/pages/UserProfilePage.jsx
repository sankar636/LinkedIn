import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FiBriefcase, FiBookOpen } from "react-icons/fi";
import EmptyProfile from '/EmptyProfile.svg';
import { MdOutlineEdit } from "react-icons/md";
import { UserDataContext } from "../context/UserContext";
import { PostContext } from "../context/PostContext";
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
