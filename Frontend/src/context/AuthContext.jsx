import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthDataContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthDataContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContext');
  }
  return context;
};

const AuthProvider = ({ children }) => {
    const serverUrl = 'http://localhost:4000/api'
    // const serverUrl = 'https://linkedin-q5gk.onrender.com/api'

    let value = {
        serverUrl
    }

    return (
        <AuthDataContext.Provider value={value}>
            {children}
        </AuthDataContext.Provider>
    );
};

export default AuthProvider;

