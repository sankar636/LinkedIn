import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
// import { jwtDecode } from "jwt-decode";

export const AuthDataContext = createContext();

const AuthContext = ({ children }) => {
    const serverUrl = 'http://localhost:4000/api'

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

