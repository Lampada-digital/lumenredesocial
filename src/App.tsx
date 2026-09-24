import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import AuthPage from './pages/Auth';
import FeedPage from './pages/Feed';
import ProfilePage from './pages/Profile';
import CommunitiesPage from './pages/Communities';
import MessagesPage from './pages/Messages';
import EventsPage from './pages/Events';
import PrayerPage from './pages/Prayer';
import FormationPage from './pages/Formation';
import ExplorePage from './pages/Explore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2L12 22M7 7L17 7M5 12L19 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="w-5 h-5 border-2 border-surface-300 border-t-primary-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="w-5 h-5 border-2 border-surface-300 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<FeedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/prayer" element={<PrayerPage />} />
        <Route path="/formation" element={<FormationPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/settings" element={<SettingsPlaceholder />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function SettingsPlaceholder() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-serif font-semibold text-surface-900 tracking-tight mb-6">Configurações</h1>
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm divide-y divide-surface-100">
        {[
          { label: 'Perfil', desc: 'Editar informações do perfil' },
          { label: 'Privacidade', desc: 'Controle quem pode ver seus dados' },
          { label: 'Notificações', desc: 'Gerenciar notificações' },
          { label: 'Segurança', desc: 'Senha, autenticação em dois fatores' },
          { label: 'Aparência', desc: 'Tema e preferências visuais' },
          { label: 'Idioma', desc: 'Português (Brasil)' },
          { label: 'Sobre', desc: 'Versão 1.0.0' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 hover:bg-surface-50 cursor-pointer transition-colors group">
            <div>
              <p className="text-sm font-semibold text-surface-900">{item.label}</p>
              <p className="text-xs text-surface-500 mt-0.5">{item.desc}</p>
            </div>
            <svg className="w-4 h-4 text-surface-400 group-hover:text-surface-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
