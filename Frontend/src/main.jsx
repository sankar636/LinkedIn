import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './context/AuthContext.jsx'
import UserContext from './context/UserContext.jsx'
import PostProvider from './context/PostContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContext>
        <UserContext>
          <PostProvider>
            <App />
          </PostProvider>
        </UserContext>
      </AuthContext>
    </BrowserRouter>
  </StrictMode>
)
