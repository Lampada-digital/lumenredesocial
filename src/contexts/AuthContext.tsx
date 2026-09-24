import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import * as localDb from '../lib/localDatabase';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<any>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

interface RegisterData {
  full_name: string;
  email: string;
  username: string;
  password: string;
  city?: string;
  parish?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

function mapProfileToUser(profile: any): User {
  if (!profile) return null as any;
  return {
    id: profile.id,
    name: profile.full_name || profile.name,
    username: profile.username,
    email: profile.email || '',
    avatar: profile.avatar_url || profile.avatar || '',
    cover: profile.cover_url || profile.cover || '',
    bio: profile.bio || '',
    city: profile.city || '',
    parish: profile.parish || '',
    diocese: profile.diocese || '',
    role: profile.role || 'user',
    verified: profile.verified || false,
    presence: profile.presence || 'online',
    presenceMessage: profile.presence_message || 'Disponível',
    friends: profile.friends_count || 0,
    followers: profile.followers_count || 0,
    following: profile.following_count || 0,
    devotions: profile.devotions || [],
    pastorals: profile.pastorals || [],
    joinedAt: profile.created_at,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializa dados locais
  useEffect(() => {
    if (!isSupabaseConfigured) {
      localDb.initializeData();
    }
  }, []);

  // Carrega sessão ao iniciar
  useEffect(() => {
    const loadSession = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          // Modo Supabase
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await fetchAndSetProfileSupabase(session.user.id);
          }
        } else {
          // Modo Local
          const userId = localDb.getSession();
          if (userId) {
            const userData = localDb.getUserById(userId);
            if (userData) {
              setProfile(userData);
              setUser(mapProfileToUser(userData));
            } else {
              localDb.clearSession();
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    // Listener para mudanças de autenticação (Supabase)
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchAndSetProfileSupabase(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  const fetchAndSetProfileSupabase = async (userId: string) => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return;
    }

    setProfile(data);
    setUser(mapProfileToUser(data));
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      if (isSupabaseConfigured && supabase) {
        // Modo Supabase
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          await fetchAndSetProfileSupabase(data.user.id);
          return { success: true };
        }
        return { success: false, error: 'Erro ao fazer login' };
      } else {
        // Modo Local
        const userData = localDb.authenticateUser(email, password);
        if (!userData) {
          return { success: false, error: 'Email ou senha incorretos' };
        }
        localDb.saveSession(userData.id);
        setProfile(userData);
        setUser(mapProfileToUser(userData));
        return { success: true };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro desconhecido' };
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      if (isSupabaseConfigured && supabase) {
        // Modo Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.full_name,
              username: data.username,
            },
          },
        });

        if (authError) return { success: false, error: authError.message };

        if (authData.user) {
          await supabase
            .from('profiles')
            .update({
              full_name: data.full_name,
              username: data.username,
              city: data.city || null,
              parish: data.parish || null,
            })
            .eq('id', authData.user.id);

          await fetchAndSetProfileSupabase(authData.user.id);
          return { success: true };
        }

        return { success: false, error: 'Erro ao criar conta' };
      } else {
        // Modo Local
        const result = localDb.createUser({
          email: data.email,
          password: data.password,
          username: data.username,
          full_name: data.full_name,
          city: data.city,
          parish: data.parish,
        });

        if ('error' in result) {
          return { success: false, error: result.error };
        }

        localDb.saveSession(result.id);
        setProfile(result);
        setUser(mapProfileToUser(result));
        return { success: true };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro desconhecido' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      } else {
        localDb.clearSession();
      }
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<any>) => {
    if (!user) return;

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('profiles').update(data).eq('id', user.id);
        await fetchAndSetProfileSupabase(user.id);
      } else {
        localDb.updateUser(user.id, data);
        const updated = localDb.getUserById(user.id);
        if (updated) {
          setProfile(updated);
          setUser(mapProfileToUser(updated));
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  }, [user]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    if (isSupabaseConfigured && supabase) {
      await fetchAndSetProfileSupabase(user.id);
    } else {
      const updated = localDb.getUserById(user.id);
      if (updated) {
        setProfile(updated);
        setUser(mapProfileToUser(updated));
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      refreshProfile,
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
