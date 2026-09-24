import React, { useState } from 'react';
import { posts, stories, users } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Image, Video, Smile, MapPin, Send, Globe, Lock, Cross, Sparkles
} from 'lucide-react';
import type { Post } from '../types';

function StoryBubble({ story, isFirst }: { story?: typeof stories[0]; isFirst?: boolean }) {
  if (isFirst) {
    return (
      <div className="flex flex-col items-center gap-1 cursor-pointer group">
        <div className="w-16 h-16 rounded-full bg-surface-100 border-2 border-dashed border-surface-300 flex items-center justify-center group-hover:border-primary-400 transition-colors">
          <span className="text-2xl text-primary-500">+</span>
        </div>
        <span className="text-xs text-surface-600">Seu story</span>
      </div>
    );
  }
  if (!story) return null;
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer group">
      <div className={`w-16 h-16 rounded-full p-0.5 ${story.viewed ? 'bg-surface-300' : 'bg-gradient-to-br from-primary-500 to-gold-400'}`}>
        <img src={story.user.avatar} alt="" className="w-full h-full rounded-full object-cover border-2 border-white" />
      </div>
      <span className="text-xs text-surface-600 truncate max-w-[64px]">{story.user.name.split(' ')[0]}</span>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(post.saved);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
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

  return (
    <article className="bg-white rounded-2xl border border-surface-200 shadow-sm hover:shadow-md transition-shadow animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={post.author.avatar} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-surface-100" />
            {post.author.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center border-2 border-white">
                <Cross size={10} className="text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-semibold text-surface-800 text-sm">{post.author.name}</h4>
              {post.author.role === 'priest' && (
                <span className="text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-md font-medium">Padre</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-surface-500">
              <span>{timeAgo(post.createdAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {post.privacy === 'public' ? <Globe size={12} /> : <Lock size={12} />}
              </span>
            </div>
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
          <MoreHorizontal size={18} className="text-surface-500" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-surface-700 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.hashtags.map(tag => (
              <span key={tag} className="text-xs text-primary-600 hover:text-primary-700 cursor-pointer">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Media */}
      {post.media.length > 0 && (
        <div className="px-4 pb-3">
          {post.media.map(m => (
            <img key={m.id} src={m.url} alt="" className="w-full rounded-xl object-cover max-h-96" />
          ))}
        </div>
      )}

      {/* Prayer Request */}
      {post.prayerRequest && (
        <div className="mx-4 mb-3 p-3 bg-gradient-to-r from-primary-50 to-gold-50 rounded-xl border border-primary-100">
          <div className="flex items-center gap-2 mb-1">
            <Heart size={16} className="text-primary-600" />
            <span className="text-xs font-medium text-primary-700">Pedido de Oração</span>
          </div>
          <p className="text-sm text-surface-700 font-medium">{post.prayerRequest.title}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-surface-500">{post.prayerRequest.prayersCount} pessoas rezando</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-surface-100">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className={`flex items-center gap-1.5 transition-all ${liked ? 'text-red-500' : 'text-surface-500 hover:text-red-500'}`}>
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} className="transition-all" />
            <span className="text-xs font-medium">{likes}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-surface-500 hover:text-primary-600 transition-colors">
            <MessageCircle size={18} />
            <span className="text-xs font-medium">{post.comments}</span>
          </button>
          <button className="flex items-center gap-1.5 text-surface-500 hover:text-primary-600 transition-colors">
            <Share2 size={18} />
            <span className="text-xs font-medium">{post.shares}</span>
          </button>
        </div>
        <button onClick={() => setSaved(!saved)} className={`transition-colors ${saved ? 'text-gold-500' : 'text-surface-400 hover:text-gold-500'}`}>
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Comment Input */}
      {showComments && (
        <div className="px-4 pb-3 pt-2 border-t border-surface-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Escreva um comentário..."
              className="flex-1 px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
            <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function CreatePost() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-4">
      <div className="flex items-start gap-3">
        <img src={user?.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Partilhe algo com sua comunidade..."
            className="w-full resize-none border-none focus:outline-none text-sm text-surface-700 placeholder-surface-400 min-h-[60px]"
            rows={3}
          />
          <div className="flex items-center justify-between pt-3 border-t border-surface-100">
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors text-surface-500 hover:text-green-600" title="Imagem">
                <Image size={18} />
              </button>
              <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors text-surface-500 hover:text-blue-600" title="Vídeo">
                <Video size={18} />
              </button>
              <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors text-surface-500 hover:text-gold-600" title="Emoji">
                <Smile size={18} />
              </button>
              <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors text-surface-500 hover:text-red-600" title="Pedido de oração">
                <Heart size={18} />
              </button>
              <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors text-surface-500 hover:text-primary-600" title="Localização">
                <MapPin size={18} />
              </button>
            </div>
            <button
              disabled={!content.trim()}
              className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-medium rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeedPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20 lg:pb-4">
      {/* Stories */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-hide">
          <StoryBubble isFirst />
          {stories.map(story => (
            <StoryBubble key={story.id} story={story} />
          ))}
        </div>
      </div>

      {/* Create Post */}
      <CreatePost />

      {/* Posts */}
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Load More */}
      <div className="text-center py-4">
        <button className="px-6 py-2.5 bg-white border border-surface-200 rounded-xl text-sm text-surface-600 hover:bg-surface-50 transition-colors shadow-sm">
          Carregar mais publicações
        </button>
      </div>
    </div>
  );
}
