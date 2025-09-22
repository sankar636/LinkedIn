import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { userData, loading } = useContext(UserDataContext);

  if (loading) return <div>Loading...</div>;

  if (!userData) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
