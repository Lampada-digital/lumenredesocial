import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
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
      <h1 className="text-2xl font-bold text-surface-800 mb-6">Configurações</h1>
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm divide-y divide-surface-100">
        {[
          { label: 'Perfil', desc: 'Editar informações do perfil' },
          { label: 'Privacidade', desc: 'Controle quem pode ver seus dados' },
          { label: 'Notificações', desc: 'Gerenciar notificações' },
          { label: 'Segurança', desc: 'Senha, autenticação em dois fatores' },
          { label: 'Aparência', desc: 'Tema e preferências visuais' },
          { label: 'Idioma', desc: 'Português (Brasil)' },
          { label: 'Sobre', desc: 'Versão 1.0.0' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 hover:bg-surface-50 cursor-pointer transition-colors">
            <div>
              <p className="text-sm font-medium text-surface-800">{item.label}</p>
              <p className="text-xs text-surface-500">{item.desc}</p>
            </div>
            <svg className="w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
