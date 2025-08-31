import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthDataContext } from './AuthContext';
import axios from 'axios';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const { serverUrl } = useContext(AuthDataContext);
    const [edit, setEdit] = useState(false);
    const [userData, setUserData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [error, setError] = useState("");
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [followers, setFollowers] = useState(null);
    const [following, setFollowing] = useState(null);

    const token = localStorage.getItem("token");
    const getCurrentUser = async () => {
        try {
            if (!token) {
                setUserData(null);
                setLoading(false);
                return;
            }
            const result = await axios.get(`${serverUrl}/user/currentuser`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (result.data.statusCode === 200) {
                setUserData(result.data.data.user);
            }
        } catch (error) {
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };
    const getUserProfile = async (username) => {
        setLoadingProfile(true);
        try {
            const response = await axios.get(`${serverUrl}/user/profile/${username}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const data = response.data.data.user;
            const posts = response.data.data.posts;

            setProfileData(data);
            setUserPosts(posts);
            setError("");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to fetch profile data.");
            setProfileData(null);
            setUserPosts([]);
        } finally {
            setLoadingProfile(false);
        }
    };
    const updateUserProfile = async (formData) => {
        try {
            const response = await axios.put(`${serverUrl}/user/updateprofile`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (response.data.statusCode === 200) {
                setUserData(response.data.data.user);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const followUser = async (followedUserId) => {
        try {
            const response = await axios.post(
                `${serverUrl}/user/${followedUserId}/follow`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("follow User Respose", response.data.data);
            const data = response.data.data;
            if (response.status === 200) {
                await getFollower()
            }
            if (profileData && profileData._id === followedUserId) { // update profile
                await getUserProfile(profileData.username);
            }

        } catch (err) {
            console.error("Error following user:", err);
            setError("Failed to follow user. Please try again.");
        }
    }

    const getFollower = async () => {
        try {
            const response = await axios.get(`${serverUrl}/user/followUser`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            console.log("Follower", response.data.data);
            const data = response.data.data;
            setFollowers(data.followers);
            setFollowing(data.following);

        } catch (error) {

        }
    }

    useEffect(() => {
        getCurrentUser();
        getFollower();
    }, []);



    return (
        <UserDataContext.Provider value={{
            userData,
            setUserData,
            loading,
            loadingProfile,
            error,
            edit,
            setEdit,
            updateUserProfile,
            profileData,
            userPosts,
            getUserProfile,
            followers,
            following,
            getFollower,
            followUser
        }}>
            {children}
        </UserDataContext.Provider>
    );
};

export default UserContext;
