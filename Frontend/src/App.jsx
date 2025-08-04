import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import { UserDataContext } from './context/UserContext.jsx'
import ProtectedRoute from './pages/ProtectRouter.jsx'
import Profile from './pages/Profile.jsx'

const App = () => {
  let { userData, loading } = useContext(UserDataContext)
  if (loading) return <div>Loading...</div>;
  console.log(userData);

  // const isAuthenticated = userData?.user !== undefined;
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path='/profile'
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={userData ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/signup"
        element={userData ? <Navigate to="/" /> : <SignUp />}
      />
    </Routes>
  )
}

export default App