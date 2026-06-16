import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ReviewPage from './pages/ReviewPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import Layout from './components/Layout';
import './App.css';

export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const [dark, setDark] = useState(true);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      <div data-theme={dark ? 'dark' : 'light'}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="review" element={<ReviewPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </ThemeContext.Provider>
  );
}
