import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import Login from "./pages/Login";
import WordSelection from "./pages/WordSelection";
import './App.css'
import SpellingTest from './pages/SpellingTest'
import NotFoundPage from './pages/NotFoundPage'
import KS1_1 from './pages/KS1_1'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const auth = useAuth();

  // Provide a no-op for onSelectWords to satisfy required prop
  const handleSelectWords = () => {};

  return (
    <Routes>
      {/* Unprotected login route */}
      <Route path="/login" element={<Login />} />
      {/* Protected routes */}
      <Route
        path="/ks1-1"
        element={auth.isAuthenticated ? <KS1_1 onSelectWords={handleSelectWords} /> : <Navigate to="/login" replace />}
        />
      <Route
        path="/*"
        element={auth.isAuthenticated ? <WordSelection onSelectWords={handleSelectWords} /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
