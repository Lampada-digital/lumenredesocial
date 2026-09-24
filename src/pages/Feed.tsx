import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import * as localDb from '../lib/localDatabase';
import { fetchPosts, createPost, togglePostLike } from '../lib/database';
import { Heart, MessageCircle, Share2, Globe, Lock, Cross, ImageIcon, Video, Smile } from 'lucide-react';

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    if (isSupabaseConfigured) {
      const data = await fetchPosts(20, 0);
      setPosts(data);
    } else {
      // Modo local
      const data = localDb.getPosts(20, 0);
      setPosts(data);
    }
    setLoading(false);
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !user) return;

    setCreating(true);
    
    if (isSupabaseConfigured) {
      const post = await createPost({
        author_id: user.id,
        content: newPostContent,
        type: 'text',
        privacy: 'public',
      });
      if (post) {
        setPosts([post, ...posts]);
        setNewPostContent('');
      }
    } else {
      // Modo local
      const post = localDb.createPost({
        author_id: user.id,
        content: newPostContent,
        type: 'text',
        privacy: 'public',
      });
      const postWithAuthor = {
        ...post,
        author: localDb.getUserById(user.id),
      };
      setPosts([postWithAuthor, ...posts]);
      setNewPostContent('');
    }
    
    setCreating(false);
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    if (isSupabaseConfigured) {
      const result = await togglePostLike(postId, user.id);
      if (result) {
        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, likes_count: result.liked ? p.likes_count + 1 : p.likes_count - 1 }
            : p
        ));
      }
    } else {
      // Modo local
      const liked = localDb.toggleLike(postId, user.id);
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, likes_count: liked ? p.likes_count + 1 : p.likes_count - 1 }
          : p
      ));
    }
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-8 text-center">
          <div className="w-8 h-8 border-2 border-surface-300 border-t-primary-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-surface-500 mt-3">Carregando feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Create Post */}
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-5">
        <div className="flex items-start gap-3">
          <img src={user?.avatar || ''} alt="" className="w-10 h-10 rounded-full object-cover ring-1 ring-surface-100 bg-surface-100" />
          <div className="flex-1">
            <textarea
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              placeholder="O que você gostaria de partilhar?"
              className="w-full resize-none border-none focus:outline-none text-sm text-surface-700 placeholder-surface-400 min-h-[56px] leading-relaxed"
              rows={2}
            />
            <div className="flex items-center justify-between pt-3 border-t border-surface-100">
              <div className="flex items-center gap-0.5">
                <button className="p-2 rounded-lg transition-colors text-surface-400 hover:text-green-600 hover:bg-green-50" title="Imagem">
                  <ImageIcon size={16} />
                </button>
                <button className="p-2 rounded-lg transition-colors text-surface-400 hover:text-blue-600 hover:bg-blue-50" title="Vídeo">
                  <Video size={16} />
                </button>
                <button className="p-2 rounded-lg transition-colors text-surface-400 hover:text-gold-600 hover:bg-gold-50" title="Emoji">
                  <Smile size={16} />
                </button>
              </div>
              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || creating}
                className="px-4 py-2 bg-surface-900 text-white text-xs font-semibold rounded-lg hover:bg-surface-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {creating ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={32} className="text-surface-400" />
          </div>
          <h3 className="font-serif font-semibold text-surface-900 mb-2">Nenhuma publicação ainda</h3>
          <p className="text-sm text-surface-500">Seja o primeiro a partilhar algo!</p>
        </div>
      ) : (
        posts.map(post => (
          <article key={post.id} className="bg-white rounded-2xl border border-surface-200/60 shadow-sm hover:shadow-md transition-all animate-fade-in-up">
            <div className="flex items-start justify-between p-5 pb-3">
              <div className="flex items-center gap-3">
                <img src={post.author?.avatar_url || post.author?.avatar || ''} alt="" className="w-11 h-11 rounded-full object-cover ring-1 ring-surface-100 bg-surface-100" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-surface-900 text-[13px]">{post.author?.full_name}</h4>
                    {post.author?.verified && (
                      <div className="w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
                        <Cross size={8} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-surface-400 mt-0.5">
                    <span>{timeAgo(post.created_at)}</span>
                    <span>·</span>
                    {post.privacy === 'public' ? <Globe size={11} /> : <Lock size={11} />}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 pb-4">
              <p className="text-surface-700 text-[14px] leading-[1.65] whitespace-pre-line">{post.content}</p>
            </div>

            <div className="divider-gradient mx-5" />

            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-surface-500 hover:bg-surface-100 hover:text-red-500"
                >
                  <Heart size={16} />
                  <span className="text-xs font-semibold">{post.likes_count}</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-primary-600 transition-all">
                  <MessageCircle size={16} />
                  <span className="text-xs font-semibold">{post.comments_count}</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-primary-600 transition-all">
                  <Share2 size={16} />
                  <span className="text-xs font-semibold">{post.shares_count}</span>
                </button>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
