import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ListingPage from './pages/ListingPage'
import ProfilePage from './pages/ProfilePage'
import { Dashboard } from './pages/Dashboard'
import { SearchPage } from './pages/SearchPage'
import { MessagesPage } from './pages/MessagesPage'

const App = () => {
  return (
    <div>
      <Routes>
      <Route path="/" element={<LandingPage />} />
       <Route path="/listing" element={<ListingPage />} />
       <Route path="/profile" element={<ProfilePage />} />
       <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/search" element={<SearchPage />} />
       <Route path="/messages" element={<MessagesPage />} />
      </Routes>
    </div>
  )
}

export default App