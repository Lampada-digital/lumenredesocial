import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          avatar_url: string | null;
          cover_url: string | null;
          bio: string | null;
          city: string | null;
          parish: string | null;
          diocese: string | null;
          role: string;
          verified: boolean;
          presence: string;
          presence_message: string;
          devotions: string[];
          pastorals: string[];
          friends_count: number;
          followers_count: number;
          following_count: number;
          created_at: string;
          updated_at: string;
        };
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          content: string;
          type: string;
          privacy: string;
          media_urls: string[];
          hashtags: string[];
          mentions: string[];
          likes_count: number;
          comments_count: number;
          shares_count: number;
          prayer_title: string | null;
          prayer_description: string | null;
          prayer_category: string | null;
          prayers_count: number;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
