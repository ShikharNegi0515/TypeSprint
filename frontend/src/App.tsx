import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import TypingPage from './features/typing/pages/TypingPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import MultiplayerPage from './features/multiplayer/pages/MultiplayerPage';
import LeaderboardPage from './features/leaderboard/pages/LeaderboardPage';
import DailyChallengePage from './features/daily-challenge/pages/DailyChallengePage';
import SettingsPage from './features/settings/pages/SettingsPage';
import SecurityPage from './features/legal/pages/SecurityPage';
import PrivacyPage from './features/legal/pages/PrivacyPage';
import TermsPage from './features/legal/pages/TermsPage';
import ContactPage from './features/legal/pages/ContactPage';
import SupportPage from './features/legal/pages/SupportPage';
import ForgotPasswordPage from './features/legal/pages/ForgotPasswordPage';
import ChangePasswordPage from './features/settings/pages/ChangePasswordPage';
import NotFoundPage from './features/legal/pages/NotFoundPage';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from './store';
import { setCredentials, logout } from './store/slices/authSlice';
import { api } from './lib/axios';
import { useTheme } from './hooks/useTheme';
import './App.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  useTheme(); // Initialize global theme listener
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (token && !user) {
      api.get('/auth/me')
        .then(res => {
          dispatch(setCredentials({ access_token: token, user: res.data }));
        })
        .catch(err => {
          console.error('Session restore failed:', err);
          dispatch(logout());
        });
    }
  }, [token, user, dispatch]);

  // If we have a token but no user yet, we are still loading the session
  if (token && !user) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading session...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/security" element={<SecurityPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/" element={<ProtectedRoute><TypingPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/multiplayer" element={<ProtectedRoute><MultiplayerPage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      <Route path="/daily" element={<ProtectedRoute><DailyChallengePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/settings/password" element={<ChangePasswordPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
