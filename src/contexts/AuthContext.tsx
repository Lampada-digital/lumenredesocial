import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { currentUser } from '../data/mockData';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Simulated auth - in production this would call the backend API
    await new Promise(resolve => setTimeout(resolve, 800));
    if (email) {
      setUser(currentUser);
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (_data: RegisterData): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser(currentUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
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
