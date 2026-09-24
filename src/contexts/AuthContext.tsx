import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { currentUser } from '../data/mockData';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

interface RegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
  city: string;
  parish: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'lumen_session';
const SESSION_EXPIRY_KEY = 'lumen_session_expiry';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

function isSessionValid(): boolean {
  try {
    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
    if (!expiry) return false;
    return Date.now() < parseInt(expiry, 10);
  } catch {
    return false;
  }
}

function loadSession(): User | null {
  try {
    if (!isSessionValid()) {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_EXPIRY_KEY);
      return null;
    }
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

function saveSession(user: User): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    localStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + SESSION_DURATION));
  } catch {
    // Storage full or unavailable - non-critical
  }
}

function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
  } catch {
    // Non-critical
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    const session = loadSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Simulated auth - in production this would call the backend API
    await new Promise(resolve => setTimeout(resolve, 800));
    if (email) {
      setUser(currentUser);
      saveSession(currentUser);
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (_data: RegisterData): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser(currentUser);
    saveSession(currentUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearSession();
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      saveSession(updated);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
