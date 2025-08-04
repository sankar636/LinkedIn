import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import { FiMail, FiUser, FiBriefcase, FiBookOpen, FiPlus, FiCamera } from "react-icons/fi";
import EmptyProfile from '/EmptyProfile.svg'
import { MdOutlineEdit } from "react-icons/md";


const Profile = () => {
    const { userData, edit, setEdit } = useContext(UserDataContext);
    const navigate = useNavigate()

    if (!userData) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen w-full pt-[90px] flex flex-col items-center">
            <Navbar />
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 my-4">
                <div className='w-full min-h-[200px] bg-white rounded-lg p-[10px] relative'>
                    <div className='w-full h-[150px] bg-gray-300 rounded overflow-hidden flex items-center justify-center'>
                        <img src={userData?.coverImage || " "} alt="" />
                    </div>
                    <div className='w-[100px] h-[100px] rounded-full overflow-hidden items-center justify-center absolute top-[80px] left-[30px]'>
                        <img
                            src={userData?.profilePic || `${EmptyProfile}`}
                            alt="Profile"
                            className="h-full"
                        />
                    </div>
                    <div className="flex justify-between">
                        <div className='mt-[15px] pl-[20px]'>
                            <div>{`${userData?.firstname}`} {`${userData?.lastname}`}</div>
                            <div>{userData?.headLine || ""}</div>
                            <div className='text-gray-400'>{userData?.location}</div>
                        </div>
                        <div className="mt-4">
                            {userData.education?.length > 0 && (
                                <div className="border-l-4 border-red-500 pl-4 mb-4">
                                    <p className="text-gray-600">{userData.education[0].college}</p>
                                    <h4 className="font-medium">{userData.education[0].degree}</h4>
                                </div>
                            )}

                        </div>
                    </div>
                    <button className="w-full mt-3 py-2 border rounded-full text-blue-600 font-semibold hover:bg-blue-50 flex items-center justify-center gap-2.5 cursor-pointer"
                        onClick={() => {
                            navigate('/');
                            setEdit(true);
                        }}                    >
                        Edit Profile <MdOutlineEdit />
                    </button>
                </div>
                {userData.skills?.length > 0 && (
                    <div className="mt-6 px-2">
                        <h3 className="text-lg font-semibold mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {userData.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {userData.experience?.length > 0 && (
                    <div className="mt-6 px-2">
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <FiBriefcase className="w-5 h-5 mr-2" /> Experience
                        </h3>
                        {userData.experience.map((exp, index) => (
                            <div
                                key={index}
                                className="border-l-4 border-blue-500 pl-4 mb-4"
                            >
                                <h4 className="font-medium">{exp.title}</h4>
                                <p className="text-gray-600">{exp.company}</p>
                                <p className="text-gray-500 text-sm">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                )}
                {userData.education?.length > 0 && (
                    <div className="mt-6 px-2">
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <FiBookOpen className="w-5 h-5 mr-2" /> Education
                        </h3>
                        {userData.education.map((edu, index) => (
                            <div
                                key={index}
                                className="border-l-4 border-green-500 pl-4 mb-4"
                            >
                                <h4 className="font-medium">{edu.degree}</h4>
                                <p className="text-gray-600">{edu.college}</p>
                                <p className="text-gray-500 text-sm">{edu.fieldOfStudy}</p>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-6 grid grid-cols-2 gap-4 text-gray-700">
                    <div>
                        <h4 className="font-semibold">Location</h4>
                        <p>{userData.location || "Not specified"}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">Gender</h4>
                        <p>{userData.gender || "Not specified"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
