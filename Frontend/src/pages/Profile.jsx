import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FiBriefcase, FiBookOpen } from "react-icons/fi";
import EmptyProfile from '/EmptyProfile.svg';
import { MdOutlineEdit } from "react-icons/md";
import { UserDataContext } from "../context/UserContext";
import { PostContext } from "../context/PostContext";

const Profile = () => {
    const { userData, setEdit } = useContext(UserDataContext);
    const { posts } = useContext(PostContext);
    const navigate = useNavigate();

    if (!userData) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600">
                Loading profile...
            </div>
        );
    }

    // Filter posts of the current user
    const userPosts = posts.filter(post => post.author?._id === userData._id);
    console.log(userPosts);
    

    return (
        <div className="bg-gray-100 min-h-screen w-full pt-[90px] flex flex-col items-center">
            <Navbar />
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 my-4">
                <div className="relative">
                    <div className="w-full h-[150px] bg-gray-300 rounded overflow-hidden">
                        <img src={userData.coverImage || ""} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden absolute top-[100px] left-[30px] border-4 border-white shadow-md">
                        <img
                            src={userData.profilePic || EmptyProfile}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="mt-16 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{userData.firstname} {userData.lastname}</h2>
                        <p className="text-gray-600">{userData.headLine || "No headline provided"}</p>
                        <p className="text-gray-400">{userData.location || "Location not specified"}</p>
                    </div>
                    {userData.education?.length > 0 && (
                        <div className="border-l-4 border-red-500 pl-4">
                            <p className="text-gray-600">{userData.education[0].college}</p>
                            <h4 className="font-medium">{userData.education[0].degree}</h4>
                        </div>
                    )}
                </div>
                <button
                    className="w-full mt-3 py-2 border rounded-full text-blue-600 font-semibold hover:bg-blue-50 flex items-center justify-center gap-2.5 cursor-pointer"
                    onClick={() => {
                        navigate('/');
                        setEdit(true);
                    }}
                >
                    Edit Profile <MdOutlineEdit />
                </button>
                {userData.skills?.length > 0 && (
                    <div className="mt-6">
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
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <FiBriefcase className="w-5 h-5 mr-2" /> Experience
                        </h3>
                        {userData.experience.map((exp, index) => (
                            <div key={index} className="border-l-4 border-blue-500 pl-4 mb-4">
                                <h4 className="font-medium">{exp.title}</h4>
                                <p className="text-gray-600">{exp.company}</p>
                                <p className="text-gray-500 text-sm">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                )}
                {userData.education?.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <FiBookOpen className="w-5 h-5 mr-2" /> Education
                        </h3>
                        {userData.education.map((edu, index) => (
                            <div key={index} className="border-l-4 border-green-500 pl-4 mb-4">
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
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Activity</h3>
                    {userPosts.length > 0 ? (
                        userPosts.map((post, index) => (
                            <div key={index} className="border p-3 rounded-lg mb-3 shadow-sm">
                                <p className="text-gray-800">{post.description}</p>
                                <span className="text-gray-500 text-sm">
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
