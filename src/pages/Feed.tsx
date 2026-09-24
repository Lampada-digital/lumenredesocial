import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import * as localDb from '../lib/localDatabase';
import { fetchPosts, createPost, togglePostLike } from '../lib/database';
import EmojiPicker from '../components/EmojiPicker';
import { Heart, MessageCircle, Share2, Globe, Lock, Cross, ImageIcon, Video, Smile, X } from 'lucide-react';

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [creating, setCreating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState('');

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
        type: selectedVideo ? 'video' : selectedImage ? 'image' : 'text',
        privacy: 'public',
      });
      if (post) {
        setPosts([post, ...posts]);
        setNewPostContent('');
        setSelectedImage(null);
        setSelectedVideo(null);
      }
    } else {
      // Modo local
      let post;
      if (selectedVideo) {
        post = localDb.createPostWithVideo({
          author_id: user.id,
          content: newPostContent,
          video_url: selectedVideo,
          privacy: 'public',
        });
      } else if (selectedImage) {
        post = localDb.createPostWithImage({
          author_id: user.id,
          content: newPostContent,
          type: 'image',
          privacy: 'public',
          image_url: selectedImage,
        });
      } else {
        post = localDb.createPost({
          author_id: user.id,
          content: newPostContent,
          type: 'text',
          privacy: 'public',
        });
      }
      const postWithAuthor = {
        ...post,
        author: localDb.getUserById(user.id),
      };
      setPosts([postWithAuthor, ...posts]);
      setNewPostContent('');
      setSelectedImage(null);
      setSelectedVideo(null);
    }
    
    setCreating(false);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await localDb.fileToBase64(file);
    setSelectedImage(base64);
  };

  const handleToggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  const handleAddComment = (postId: string) => {
    if (!user || !newComments[postId]?.trim()) return;

    const comment = localDb.createComment(postId, user.id, newComments[postId]);
    const commentWithAuthor = {
      ...comment,
      author: localDb.getUserById(user.id),
    };

    // Atualiza o post com o novo comentário
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments_count: p.comments_count + 1,
          comments: [...(p.comments || []), commentWithAuthor],
        };
      }
      return p;
    }));

    setNewComments({ ...newComments, [postId]: '' });
  };

  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verifica se é um vídeo
    if (!file.type.startsWith('video/')) {
      alert('Por favor, selecione um arquivo de vídeo');
      return;
    }

    // Limita o tamanho do vídeo a 10MB para localStorage
    if (file.size > 10 * 1024 * 1024) {
      alert('O vídeo deve ter no máximo 10MB');
      return;
    }

    const base64 = await localDb.fileToBase64(file);
    setSelectedVideo(base64);
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewPostContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleShare = (postId: string) => {
    if (!user) return;

    const sharedPost = localDb.sharePost(postId, user.id, shareMessage || undefined);
    const sharedPostWithAuthor = {
      ...sharedPost,
      author: localDb.getUserById(user.id),
    };

    setPosts([sharedPostWithAuthor, ...posts]);
    setShowShareModal(null);
    setShareMessage('');
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
          <div className="flex-1 relative">
            <textarea
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              placeholder="O que você gostaria de partilhar?"
              className="w-full resize-none border-none focus:outline-none text-sm text-surface-700 placeholder-surface-400 min-h-[56px] leading-relaxed"
              rows={2}
            />
            
            {/* Image Preview */}
            {selectedImage && (
              <div className="relative mt-3 mb-3">
                <img src={selectedImage} alt="Preview" className="w-full max-h-96 object-cover rounded-xl" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Video Preview */}
            {selectedVideo && (
              <div className="relative mt-3 mb-3">
                <video src={selectedVideo} controls className="w-full max-h-96 rounded-xl" />
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-3 border-t border-surface-100">
              <div className="flex items-center gap-0.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-lg transition-colors text-surface-400 hover:text-green-600 hover:bg-green-50"
                  title="Imagem"
                >
                  <ImageIcon size={16} />
                </button>
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="p-2 rounded-lg transition-colors text-surface-400 hover:text-blue-600 hover:bg-blue-50"
                  title="Vídeo"
                >
                  <Video size={16} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 rounded-lg transition-colors text-surface-400 hover:text-gold-600 hover:bg-gold-50"
                    title="Emoji"
                  >
                    <Smile size={16} />
                  </button>
                  {showEmojiPicker && (
                    <EmojiPicker
                      onSelect={handleEmojiSelect}
                      onClose={() => setShowEmojiPicker(false)}
                    />
                  )}
                </div>
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
              {post.media_urls && post.media_urls.length > 0 && (
                <div className="mt-3">
                  {post.type === 'video' ? (
                    <video src={post.media_urls[0]} controls className="w-full rounded-xl" />
                  ) : (
                    <img src={post.media_urls[0]} alt="" className="w-full rounded-xl" />
                  )}
                </div>
              )}
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
                <button
                  onClick={() => handleToggleComments(post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-primary-600 transition-all"
                >
                  <MessageCircle size={16} />
                  <span className="text-xs font-semibold">{post.comments_count}</span>
                </button>
                <button
                  onClick={() => setShowShareModal(post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-primary-600 transition-all"
                >
                  <Share2 size={16} />
                  <span className="text-xs font-semibold">{post.shares_count}</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {expandedComments.has(post.id) && (
              <div className="px-5 pb-4 border-t border-surface-100 pt-3">
                {/* Existing Comments */}
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-3 mb-3">
                    {post.comments.map((comment: any) => (
                      <div key={comment.id} className="flex gap-2">
                        <img
                          src={comment.author?.avatar_url || comment.author?.avatar || ''}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-surface-100"
                        />
                        <div className="flex-1 bg-surface-50 rounded-xl px-3 py-2">
                          <p className="text-xs font-semibold text-surface-900">{comment.author?.full_name}</p>
                          <p className="text-sm text-surface-700 mt-0.5">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="flex gap-2">
                  <img
                    src={user?.avatar || ''}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-surface-100"
                  />
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newComments[post.id] || ''}
                      onChange={e => setNewComments({ ...newComments, [post.id]: e.target.value })}
                      onKeyPress={e => e.key === 'Enter' && handleAddComment(post.id)}
                      placeholder="Escreva um comentário..."
                      className="flex-1 px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      disabled={!newComments[post.id]?.trim()}
                      className="px-3 py-2 bg-surface-900 text-white text-xs font-semibold rounded-xl hover:bg-surface-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </article>
        ))
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-semibold text-surface-900">Compartilhar Publicação</h2>
              <button
                onClick={() => {
                  setShowShareModal(null);
                  setShareMessage('');
                }}
                className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5 uppercase tracking-wide">
                  Adicione uma mensagem (opcional)
                </label>
                <textarea
                  value={shareMessage}
                  onChange={e => setShareMessage(e.target.value)}
                  placeholder="O que você quer dizer sobre esta publicação?"
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowShareModal(null);
                    setShareMessage('');
                  }}
                  className="flex-1 px-4 py-3 bg-surface-100 text-surface-700 rounded-xl text-sm font-semibold hover:bg-surface-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleShare(showShareModal)}
                  className="flex-1 px-4 py-3 bg-surface-900 text-white rounded-xl text-sm font-semibold hover:bg-surface-800 transition-colors"
                >
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
