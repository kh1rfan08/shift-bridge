import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import CheckInbox from './pages/CheckInbox';
import AuthCallback from './pages/AuthCallback';
import ThePit from './pages/ThePit';
import PostShift from './pages/PostShift';
import ShiftDetail from './pages/ShiftDetail';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pit-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Onboarding gate: if no name set, force profile
  if (!user.name && window.location.pathname !== '/profile') {
    return <Navigate to="/profile" replace />;
  }

  return (
    <>
      {children}
      <NavBar />
    </>
  );
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/check-inbox" element={<CheckInbox />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route path="/" element={<ProtectedRoute><ThePit /></ProtectedRoute>} />
        <Route path="/post" element={<ProtectedRoute><PostShift /></ProtectedRoute>} />
        <Route path="/shifts/:id" element={<ProtectedRoute><ShiftDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
