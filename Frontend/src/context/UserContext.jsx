import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthDataContext } from './AuthContext';
import axios from 'axios';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { serverUrl } = useContext(AuthDataContext);
    const [edit, setEdit] = useState(false);

    const getCurrentUser = async () => {
        try {
            const result = await axios.get(`${serverUrl}/user/currentuser`, {
                withCredentials: true,
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

    useEffect(() => {
        getCurrentUser();
    }, []);

    return (
        <UserDataContext.Provider value={{ userData, setUserData, loading, edit, setEdit, updateUserProfile }}>
            {children}
        </UserDataContext.Provider>
    );
};

export default UserContext;
