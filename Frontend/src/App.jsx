import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import { UserDataContext } from './context/UserContext.jsx'
import ProtectedRoute from './pages/ProtectRouter.jsx'
import Profile from './pages/Profile.jsx'
import UserProfilePage from './pages/UserProfilePage.jsx'
import MyNetwork from './pages/MyNetwork.jsx'
import Notification from './pages/Notification.jsx'
import { Toaster } from 'react-hot-toast';
import NotificationHandler from './components/NotificationHandler.jsx'
import ChatPage from './pages/ChatPage.jsx'


const App = () => {
  let { userData, loading } = useContext(UserDataContext)
  if (loading) return <div>Loading...</div>;
  return (
    <>
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
        <Route path='/profile/:username'
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path='/network'
          element={
            <ProtectedRoute>
              <MyNetwork />
            </ProtectedRoute>
          }
        />
        <Route path='/notification'
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />
        <Route path='/chatPage'
          element={
            <ProtectedRoute>
              <ChatPage />
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
      <Toaster position="top-center" reverseOrder={true} />
      {userData && <NotificationHandler />}
    </>
  )
}

export default App