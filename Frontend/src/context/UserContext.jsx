import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthDataContext } from './AuthContext';
import axios from 'axios';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { serverUrl } = useContext(AuthDataContext);

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

    useEffect(() => {
        getCurrentUser();
    }, []);

    return (
        <UserDataContext.Provider value={{ userData, setUserData, loading }}>
            {children}
        </UserDataContext.Provider>
    );
};

export default UserContext;
