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


export default function App() {
  const auth = useAuth();
 
  const [selectedList, setSelectedList] = useState<{ words: string[]; type: 'single' | 'less_family' } | null>(null)

  const handleSelectWords = (words: string[], type: 'single' | 'less_family') => {
    setSelectedList({ words, type })
  }
  // const handleSelectWords = () => {};

  const handleReset = () => {
    setSelectedList(null)
  }

  if (auth.isLoading) {
    // Wait for OIDC to finish loading before rendering routes
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
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
    </>
  );
}
