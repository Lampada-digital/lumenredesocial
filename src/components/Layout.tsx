import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notifications } from '../data/mockData';
import {
  Home, Users, MessageCircle, Calendar, Heart,
  Search, Bell, Menu, X, Church, GraduationCap, Settings,
  LogOut, User, ChevronDown, Compass
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

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-surface-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left: Logo + Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
              aria-label="Menu"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-md">
                <Church size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent hidden sm:block">
                Lumen
              </span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Buscar pessoas, comunidades, eventos..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-100 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button className="md:hidden p-2.5 rounded-xl hover:bg-surface-100 transition-colors" aria-label="Buscar">
              <Search size={20} className="text-surface-600" />
            </button>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-surface-100 transition-colors"
              aria-label="Notificações"
            >
              <Bell size={20} className="text-surface-600" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadNotifications}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-100 transition-colors"
            >
              <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200" />
              <ChevronDown size={14} className="text-surface-500 hidden sm:block" />
            </button>
          </div>
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-4 top-16 w-80 bg-white rounded-2xl shadow-xl border border-surface-200 py-2 animate-fade-in z-50">
            <div className="px-4 py-2 border-b border-surface-100">
              <h3 className="font-semibold text-surface-800">Notificações</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map(n => (
                <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-surface-50 transition-colors ${!n.read ? 'bg-primary-50/50' : ''}`}>
                  <img src={n.user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-surface-700">
                      <span className="font-medium">{n.user.name}</span> {n.content}
                    </p>
                    <p className="text-xs text-surface-400 mt-0.5">
                      {new Date(n.createdAt).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-primary-500 rounded-full mt-2" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Menu Dropdown */}
        {showUserMenu && (
          <div className="absolute right-4 top-16 w-64 bg-white rounded-2xl shadow-xl border border-surface-200 py-2 animate-fade-in z-50">
            <div className="px-4 py-3 border-b border-surface-100">
              <p className="font-medium text-surface-800">{user?.name}</p>
              <p className="text-sm text-surface-500">@{user?.username}</p>
            </div>
            <div className="py-1">
              <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 transition-colors text-surface-700" onClick={() => setShowUserMenu(false)}>
                <User size={18} /> Meu Perfil
              </Link>
              <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 transition-colors text-surface-700" onClick={() => setShowUserMenu(false)}>
                <Settings size={18} /> Configurações
              </Link>
              <hr className="my-1 border-surface-100" />
              <button onClick={() => { logout(); setShowUserMenu(false); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-600 w-full text-left">
                <LogOut size={18} /> Sair
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 bottom-0 w-72 bg-white border-r border-surface-200 z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <nav className="p-4 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                    : 'text-surface-600 hover:bg-surface-50 hover:text-surface-800'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-primary-600' : ''} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 mt-4 border-t border-surface-100">
          <Link
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors"
          >
            <img src={user?.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-800 truncate">{user?.name}</p>
              <p className="text-xs text-surface-500 truncate">@{user?.username}</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-16 lg:pl-72 min-h-screen">
        <div className="p-4 lg:p-6 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 lg:hidden z-30">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive ? 'text-primary-600' : 'text-surface-500'
                }`}
              >
                <item.icon size={20} />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
