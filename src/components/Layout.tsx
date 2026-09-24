import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notifications } from '../data/mockData';
import {
  Home, Users, MessageCircle, Calendar, GraduationCap,
  Search, Bell, Menu, X, Compass, Settings,
  LogOut, User, ChevronDown, Heart
} from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Feed' },
  { path: '/communities', icon: Users, label: 'Comunidades' },
  { path: '/messages', icon: MessageCircle, label: 'Mensagens' },
  { path: '/events', icon: Calendar, label: 'Eventos' },
  { path: '/prayer', icon: Heart, label: 'Oração' },
  { path: '/formation', icon: GraduationCap, label: 'Formação' },
  { path: '/explore', icon: Compass, label: 'Explorar' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-surface-50 bg-mesh">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-surface-200/60 shadow-premium">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          {/* Left: Logo + Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-100 transition-colors"
              aria-label="Menu"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-premium group-hover:shadow-premium-lg transition-all group-hover:scale-105">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M12 2L12 22M7 7L17 7M5 12L19 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-serif font-bold tracking-tight text-gradient">
                  Lumen
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Buscar pessoas, comunidades, paróquias..."
                className="w-full pl-11 pr-4 py-2.5 bg-surface-100/80 border border-transparent rounded-xl text-sm text-surface-700 placeholder-surface-400 focus:outline-none focus:bg-white focus:border-surface-200 focus:shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            <button className="md:hidden p-2.5 rounded-xl hover:bg-surface-100 transition-colors" aria-label="Buscar">
              <Search size={18} className="text-surface-600" />
            </button>

            <div ref={notifRef} className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                className="relative p-2.5 rounded-xl hover:bg-surface-100 transition-colors"
                aria-label="Notificações"
              >
                <Bell size={18} className="text-surface-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-semibold rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl shadow-surface-900/10 border border-surface-200/80 animate-scale-in z-50 overflow-hidden">
                  <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
                    <h3 className="font-semibold text-surface-900 text-sm">Notificações</h3>
                    <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">Marcar todas como lidas</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`flex items-start gap-3 px-5 py-3.5 hover:bg-surface-50/80 transition-colors cursor-pointer ${!n.read ? 'bg-primary-50/30' : ''}`}>
                        <img src={n.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-1 ring-surface-100" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-surface-700 leading-snug">
                            <span className="font-semibold text-surface-900">{n.user.name}</span>{' '}
                            <span className="text-surface-600">{n.content}</span>
                          </p>
                          <p className="text-xs text-surface-400 mt-1 font-medium">
                            {new Date(n.createdAt).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {!n.read && <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 border-t border-surface-100 bg-surface-50/50">
                    <button className="w-full text-center text-xs font-medium text-primary-600 hover:text-primary-700">
                      Ver todas as notificações
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                className="flex items-center gap-2 p-1.5 pr-2 rounded-xl hover:bg-surface-100 transition-colors"
              >
                <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-100" />
                <ChevronDown size={14} className="text-surface-400 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl shadow-surface-900/10 border border-surface-200/80 animate-scale-in z-50 overflow-hidden">
                  <div className="px-4 py-4 border-b border-surface-100 bg-gradient-to-br from-primary-50/50 to-gold-50/30">
                    <p className="font-semibold text-surface-900 text-sm">{user?.name}</p>
                    <p className="text-xs text-surface-500 mt-0.5">@{user?.username}</p>
                  </div>
                  <div className="py-1.5">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 transition-colors text-surface-700 text-sm" onClick={() => setShowUserMenu(false)}>
                      <User size={16} className="text-surface-500" /> Meu Perfil
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 transition-colors text-surface-700 text-sm" onClick={() => setShowUserMenu(false)}>
                      <Settings size={16} className="text-surface-500" /> Configurações
                    </Link>
                    <hr className="my-1.5 border-surface-100" />
                    <button onClick={() => { logout(); setShowUserMenu(false); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-600 w-full text-left text-sm">
                      <LogOut size={16} /> Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" />
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 bottom-0 w-[260px] bg-white/80 backdrop-blur-xl border-r border-surface-200/60 z-40 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <nav className="p-3 space-y-0.5">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-surface-600 hover:bg-surface-100/80 hover:text-surface-900'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-primary-100' : 'bg-transparent group-hover:bg-surface-200/60'}`}>
                  <item.icon size={18} className={isActive ? 'text-primary-600' : 'text-surface-500 group-hover:text-surface-700'} />
                </div>
                <span className="text-[13px]">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-primary-500 rounded-full" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white via-white to-white/0">
          <Link
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-100/80 transition-colors"
          >
            <img src={user?.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900 truncate">{user?.name}</p>
              <p className="text-xs text-surface-500 truncate">@{user?.username}</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-16 lg:pl-[260px] min-h-screen">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-surface-200/60 lg:hidden z-30">
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.slice(0, 5).map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? 'text-primary-600' : 'text-surface-500'
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
