import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import ListingPage from './pages/ListingPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { SearchPage } from './pages/SearchPage.jsx'
import { MessagesPage } from './pages/MessagesPage.jsx'

import Navbar from './components/Navbar.jsx'

import { useUser } from "@clerk/react";

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();
 
  // Wait for Clerk to finish loading auth state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
 
  // Not logged in → send back to landing
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }
 
  return children;
}
 
// ── Layout for protected pages (includes Navbar + padding) ────
function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      {/* pt-20 to push content below fixed navbar */}
      <div className="pt-20">
        {children}
      </div>
    </div>
  );
}

const App = () => {
  return (
    <div>
      {/* <Routes>
      <Route path="/" element={<LandingPage />} />
       <Route path="/listing" element={<ListingPage />} />
       <Route path="/profile" element={<ProfilePage />} />
       <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/search" element={<SearchPage />} />
       <Route path="/messages" element={<MessagesPage />} />
      </Routes> */}
      <Routes>
 
      {/* ── Public Route ── */}
      {/* Landing page — no auth needed, no navbar */}
      <Route path="/" element={<LandingPage />} />

      {/* ── Protected Routes ── */}
      {/* All routes below require Clerk sign-in */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SearchPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/:id?"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/listing"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ListingPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/messages/:id?"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MessagesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* ── Fallback: unknown URL → home ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App