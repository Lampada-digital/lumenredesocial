import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
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

// Mapeia perfil do Supabase para User da aplicação
function mapProfileToUser(profile: any): User {
  if (!profile) return null as any;
  return {
    id: profile.id,
    name: profile.full_name,
    username: profile.username,
    email: '', // Não expomos email diretamente
    avatar: profile.avatar_url || '',
    cover: profile.cover_url || '',
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

  // Carrega sessão ao iniciar
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    const loadSession = async () => {
      try {
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await fetchAndSetProfile(session.user.id);
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchAndSetProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchAndSetProfile = async (userId: string) => {
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
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase não configurado' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchAndSetProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Erro ao fazer login' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro desconhecido' };
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase não configurado' };
    }

    try {
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

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        // Atualiza perfil com dados adicionais
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: data.full_name,
            username: data.username,
            city: data.city || null,
            parish: data.parish || null,
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Erro ao atualizar perfil:', profileError);
        }

        await fetchAndSetProfile(authData.user.id);
        return { success: true };
      }

      return { success: false, error: 'Erro ao criar conta' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro desconhecido' };
    }
  }, []);

  const logout = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<any>) => {
    if (!isSupabaseConfigured || !supabase || !user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        return;
      }

      await fetchAndSetProfile(user.id);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  }, [user]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await fetchAndSetProfile(user.id);
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
