import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthDataContext = createContext();

const AuthContext = ({ children }) => {
    // const serverUrl = 'http://localhost:4000/api'
    const serverUrl = 'https://linkedin-q5gk.onrender.com/'

    let value = {
        serverUrl
    }

    return (
        <AuthDataContext.Provider value={value}>
            {children}
        </AuthDataContext.Provider>
    );
};

export default AuthContext;

