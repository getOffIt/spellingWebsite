import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import Login from "./pages/Login";
import SpellingChart from './pages/SpellingChart';
import OctoberSpellingChart from './pages/OctoberSpellingChart';
import ChallengesPage from "./pages/ChallengesPage";
import WordSelection from "./pages/WordSelection";
import CommonWordsSelection from "./pages/CommonWordsSelection";
import SpellingListASelection from "./pages/SpellingListASelection";
import SpellingListBSelection from "./pages/SpellingListBSelection";
import AnimalDietsSelection from "./pages/AnimalDietsSelection";
import WeeklySpellingsSelection from "./pages/WeeklySpellingsSelection";
import './App.css'
import SpellingTest from './pages/SpellingTest'
import PracticePage from './pages/PracticePage'
import ProtectedRoute from './components/ProtectedRoute'
import ProfilePage from './pages/ProfilePage'
import Header from './components/Header'
import ApiTest from './pages/ApiTest'


export default function App() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
 
  const [selectedList, setSelectedList] = useState<{ 
    words: string[]; 
    type: 'single' | 'less_family';
    testMode?: 'practice' | 'full_test';
    passThreshold?: number;
  } | null>(null)

  const handleSelectWords = (
    words: string[], 
    type: 'single' | 'less_family',
    testMode: 'practice' | 'full_test' = 'practice',
    passThreshold?: number
  ) => {
    // Shuffle word order for practice mode to prevent restart cherry-picking
    // Full test mode keeps original order (deterministic for fairness)
    const shuffled = testMode === 'practice'
      ? [...words].sort(() => Math.random() - 0.5)
      : words;
    setSelectedList({ words: shuffled, type, testMode, passThreshold })
  }

  const handleReset = () => {
    setSelectedList(null)
    navigate(location.state?.returnTo || "/");
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
            path="/word-selection"
            element={
              <ProtectedRoute>
                <WordSelection onSelectWords={handleSelectWords} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/common-words-selection"
            element={
              <ProtectedRoute>
                <CommonWordsSelection onSelectWords={handleSelectWords} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/animal-diets"
            element={
              <ProtectedRoute>
                <AnimalDietsSelection onSelectWords={handleSelectWords} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weekly-spellings"
            element={
              <ProtectedRoute>
                <WeeklySpellingsSelection onSelectWords={handleSelectWords} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/spelling-list-a"
            element={
              <ProtectedRoute>
                <SpellingListASelection onSelectWords={handleSelectWords} />
              </ProtectedRoute>
            }
          />
          <Route path="/october-spelling-chart" element={<ProtectedRoute><OctoberSpellingChart onSelectWords={handleSelectWords} /></ProtectedRoute>} />
          <Route path="/spelling-chart" element={<ProtectedRoute><SpellingChart onSelectWords={handleSelectWords} /></ProtectedRoute>} />
          <Route
            path="/spelling-list-b"
            element={
              <ProtectedRoute>
                <SpellingListBSelection onSelectWords={handleSelectWords} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/spelling-practice"
            element={
              <ProtectedRoute>
                {location.state?.practiceWords?.length ? (
                  <PracticePage words={location.state.practiceWords} onComplete={handleReset} returnLabel="Back to word list" />
                ) : <Navigate to="/" replace />}
              </ProtectedRoute>
            }
          />
          <Route
            path="/spelling-test"
            element={
              <ProtectedRoute>
                {selectedList ? (
                  <SpellingTest 
                    words={selectedList.words} 
                    listType={selectedList.type}
                    testMode={selectedList.testMode || 'practice'}
                    passThreshold={selectedList.passThreshold}
                    returnLabel={{
                      '/spelling-chart': 'Back to Spelling Chart',
                      '/october-spelling-chart': 'Back to October Spelling Chart',
                      '/animal-diets': 'Back to Animal Diets',
                      '/weekly-spellings': 'Back to Words of the Week',
                    }[location.state?.returnTo as string]}
                    onComplete={handleReset} 
                  />
                ) : (
                  <Navigate to="/" replace />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ChallengesPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
