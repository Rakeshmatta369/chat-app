import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home.jsx'
import SignUp from './pages/SignUp.jsx'
import Login from './pages/Login.jsx'
import Settings from './pages/Settings.jsx'
import Profile from './pages/Profile.jsx'

import Navbar from './components/Navbar'

import { useEffect } from 'react'
import { useAuthStore } from './store/useAuthStore.js'

const App = () => {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
  
  // useEffect(() => {
  //   checkAuth()
  // }, [checkAuth]);

  console.log({ authUser });
  
  if (isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
    </div>
  )

  return (
    <div>
      
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

    </div>
  )
}

export default App
