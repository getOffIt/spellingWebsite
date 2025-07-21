import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import Login from "./pages/Login";
import WordSelection from "./pages/WordSelection";
import './App.css'
import SpellingTest from './pages/SpellingTest'
import KS1_1 from './pages/KS1_1'
import ProtectedRoute from './components/ProtectedRoute'
import ProfilePage from './pages/ProfilePage'
import Header from './components/Header'
import ApiTest from './pages/ApiTest'


export default function App() {
  const auth = useAuth();
 
  const [selectedList, setSelectedList] = useState<{ words: string[]; type: 'single' | 'less_family' } | null>(null)

  // Debug authentication state
  React.useEffect(() => {
    console.log('Auth state:', {
      isLoading: auth.isLoading,
      isAuthenticated: auth.isAuthenticated,
      user: auth.user,
      error: auth.error
    });
    
    // Debug localStorage contents
    console.log('localStorage contents:', {
      keys: Object.keys(localStorage),
      oidcKeys: Object.keys(localStorage).filter(key => key.includes('oidc') || key.includes('user'))
    });
  }, [auth.isLoading, auth.isAuthenticated, auth.user, auth.error]);

  // Manual session check on app load
  React.useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      console.log('App loaded, checking for existing session...');
      // Try to get user from localStorage manually
      const userKeys = Object.keys(localStorage).filter(key => key.includes('user'));
      console.log('Found user keys in localStorage:', userKeys);
      
      if (userKeys.length > 0) {
        console.log('Potential user data found, attempting silent sign-in...');
        // The OIDC library should handle this automatically, but let's log what we find
      }
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  const handleSelectWords = (words: string[], type: 'single' | 'less_family') => {
    setSelectedList({ words, type })
  }

  const handleReset = () => {
    setSelectedList(null)
  }

  if (auth.isLoading) {
    // Wait for OIDC to finish loading before rendering routes
    return <div>Checking authentication...</div>;
  }

  // If there's an authentication error, show it
  if (auth.error) {
    console.error('Authentication error:', auth.error);
  }

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Unprotected login route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route
            path="/ks1-1"
            element={
              <ProtectedRoute>
                <KS1_1 onSelectWords={handleSelectWords} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/api-test"
            element={
              <ProtectedRoute>
                <ApiTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {selectedList ? (
                  <SpellingTest 
                    words={selectedList.words} 
                    listType={selectedList.type} 
                    onComplete={handleReset} 
                  />
                ) : (
                  <WordSelection onSelectWords={handleSelectWords} />
                )}
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
