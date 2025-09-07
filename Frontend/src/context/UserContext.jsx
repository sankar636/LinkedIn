import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { AuthDataContext } from './AuthContext';
import axios from 'axios';

export const UserDataContext = createContext();
export const useUser = () => {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error('useUser must be used within a UserContext');
    }
    return context;
};
const UserProvider = ({ children }) => {
    const { serverUrl } = useContext(AuthDataContext);
    const [userData, setUserData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [followers, setFollowers] = useState(null);
    const [following, setFollowing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [error, setError] = useState("");
    const [edit, setEdit] = useState(false);

    const getToken = useCallback(() => localStorage.getItem("token"), []);
    const getCurrentUser = useCallback(async () => {
        setLoading(true);
        const token = getToken();
        if (!token) {
            setUserData(null);
            setLoading(false);
            return;
        }
        try {
            const { data } = await axios.get(`${serverUrl}/user/currentuser`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.statusCode === 200) {
                setUserData(data.data.user);
            } else {
                setUserData(null);
            }
        } catch (err) {
            setUserData(null);
            setError("Failed to fetch user data.");
        } finally {
            setLoading(false);
        }
    }, [serverUrl]);
    const getUserProfile = useCallback(async (username) => {
        setLoadingProfile(true);
        if(!username){
            setError("Username is required to fetch Profile Data");
        }
        try {
            const token = getToken();
            const { data } = await axios.get(`${serverUrl}/user/profile/${username}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userData = data.data.user
            // console.log(userData);
            setProfileData(userData);
            setUserPosts(data.data.posts);
            setError("");
        } catch (err) {
            console.log(err);
            setProfileData(null);
            setUserPosts([]);
            setError(err.response?.data?.message || "Failed to fetch profile data.");
        } finally {
            setLoadingProfile(false);
        }
    }, [serverUrl, getToken]);
    const getUserProfileById = useCallback(async (userId) => {
        setLoadingProfile(true);
        if (!userId) {
            setError("User ID is required to fetch Profile Data");
            setLoadingProfile(false);
            return;
        }
        try {
            const token = getToken();
            const { data } = await axios.get(`${serverUrl}/user/profileById/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log(data);
            const userData = data.data.user
            return userData
            setError("");
        } catch (err) {
            setProfileData(null);
            setUserPosts([]);
            setError(err.response?.data?.message || "Failed to fetch profile data.");
        } finally {
            setLoadingProfile(false);
        }
    }, [serverUrl, getToken]);
    const updateUserProfile = useCallback(async (formData) => {
        try {
            const token = getToken();
            const { data } = await axios.put(`${serverUrl}/user/updateprofile`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.statusCode === 200) {
                setUserData(data.data.user);
            }
        } catch (err) {
            setError("Error updating profile.");
        }
    }, [serverUrl]);

    const followUser = useCallback(async (followedUserId) => {
        try {
            const token = getToken();
            await axios.post(
                `${serverUrl}/user/${followedUserId}/follow`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Refresh profile if viewing the followed user
            if (profileData && profileData._id === followedUserId) {
                await getUserProfile(profileData.username);
            }
            // Update userData.following immediately for UI responsiveness
            setUserData(prev => {
                if (!prev) return prev;
                // Avoid duplicates
                if (prev.following?.includes(followedUserId)) return prev;
                return {
                    ...prev,
                    following: [...(prev.following || []), followedUserId]
                };
            });
        } catch (err) {
            setError("Failed to follow user. Please try again.");
        }
    }, [serverUrl, profileData, getUserProfile]);

    const getFollower = useCallback(async () => {
        try {
            const token = getToken();
            const { data } = await axios.get(`${serverUrl}/user/followUser`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFollowers(data.data.followers);
            setFollowing(data.data.following);
        } catch (err) {
            setError("Failed to fetch followers.");
        }
    }, [serverUrl]);

    useEffect(() => {
        getCurrentUser();
    }, [getCurrentUser]);
    const contextValue = useMemo(() => ({
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
        getUserProfileById, 
        followers,
        following,
        getFollower,
        followUser
    }), [
        userData, loading, loadingProfile, error, edit, profileData, userPosts,
        followers, following, updateUserProfile, getUserProfile, getUserProfileById, getFollower, followUser
    ]);

    return (
        <UserDataContext.Provider value={contextValue}>
            {children}
        </UserDataContext.Provider>
    );
};

export default UserProvider;
