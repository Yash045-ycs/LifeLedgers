import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage       from './pages/LandingPage';
import LoginPage         from './pages/auth/LoginPage';
import SignupPage        from './pages/auth/SignupPage';
import AppLayout         from './components/layout/AppLayout';
import DashboardPage     from './pages/app/DashboardPage';
import TimelinePage      from './pages/app/TimelinePage';
import ObligationsPage   from './pages/app/ObligationsPage';
import DocumentsPage     from './pages/app/DocumentsPage';
import SubscriptionsPage from './pages/app/SubscriptionsPage';
import AnalyticsPage     from './pages/app/AnalyticsPage';
import SettingsPage      from './pages/app/SettingsPage';
import { Spinner }       from './components/ui';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user)   return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"       element={<LandingPage />} />
      <Route path="/login"  element={<LoginPage />}   />
      <Route path="/signup" element={<SignupPage />}   />

      <Route path="/app" element={
        <ProtectedRoute><AppLayout /></ProtectedRoute>
      }>
        <Route index               element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard"    element={<DashboardPage />}     />
        <Route path="timeline"     element={<TimelinePage />}      />
        <Route path="obligations"  element={<ObligationsPage />}   />
        <Route path="documents"    element={<DocumentsPage />}     />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route path="analytics"    element={<AnalyticsPage />}     />
        <Route path="settings"     element={<SettingsPage />}      />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}