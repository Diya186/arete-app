import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import DoPage from './pages/DoPage';
import MovePage from './pages/MovePage';
import CompetePage from './pages/CompetePage';
import ReflectPage from './pages/ReflectPage';
import './styles/global.css';

export const AppContext = React.createContext(null);

const DEFAULT_STATE = {
  user: null,
  xp: 0,
  streak: 0,
  tasks: [],
  wordLearned: false,
  workouts: [],
  friends: [
    { id: 1, name: 'Vrinda', xp: 980, steps: 8420, tasksCompleted: 5, tasksTotal: 5, streak: 14 },
    { id: 2, name: 'Harshada', xp: 870, steps: 7100, tasksCompleted: 4, tasksTotal: 5, streak: 9 },
  ],
  reflections: [],
  stepGoal: 10000,
  steps: 6200,
};

export default function App() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('arete_state');
      return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : DEFAULT_STATE;
    } catch { return DEFAULT_STATE; }
  });

  useEffect(() => {
    localStorage.setItem('arete_state', JSON.stringify(state));
  }, [state]);

  const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));
  const addXP = (amount) => setState(prev => ({ ...prev, xp: prev.xp + amount }));

  return (
    <AppContext.Provider value={{ state, updateState, addXP }}>
      <Router basename={process.env.PUBLIC_URL}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={state.user ? <Navigate to="/home" /> : <LoginPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/home" element={state.user ? <HomePage /> : <Navigate to="/" />} />
            <Route path="/learn" element={state.user ? <LearnPage /> : <Navigate to="/" />} />
            <Route path="/do" element={state.user ? <DoPage /> : <Navigate to="/" />} />
            <Route path="/move" element={state.user ? <MovePage /> : <Navigate to="/" />} />
            <Route path="/compete" element={state.user ? <CompetePage /> : <Navigate to="/" />} />
            <Route path="/reflect" element={state.user ? <ReflectPage /> : <Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </AppContext.Provider>
  );
}
