import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import Login from "./pages/Login";
import WordSelection from "./pages/WordSelection";
import './App.css'
import SpellingTest from './pages/SpellingTest'
import ProtectedRoute from './components/ProtectedRoute'
import ProfilePage from './pages/ProfilePage'
import Header from './components/Header'
import ApiTest from './pages/ApiTest'


export default function App() {
  const auth = useAuth();
 
  const [selectedList, setSelectedList] = useState<{ words: string[]; type: 'single' | 'less_family' } | null>(null)

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

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Unprotected login route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
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
