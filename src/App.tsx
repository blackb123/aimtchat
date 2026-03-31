import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/pages/auth/AuthPage';
import ModernChatPage from '@/pages/chat/ModernChatPage';
import './App.css';

function App() {
  const { user, login } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/chat" replace /> :
            <AuthPage onLogin={login} />
          }
        />

        <Route
          path="/chat"
          element={
            user ? <ModernChatPage /> :
            <Navigate to="/" replace />
          }
        />

        <Route path="*" element={<Navigate to={user ? "/chat" : "/"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
