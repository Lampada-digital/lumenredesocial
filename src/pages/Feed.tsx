import React, { useState } from 'react';
import { posts, stories, users } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Image, Video, Smile, MapPin, Send, Globe, Lock, Cross
} from 'lucide-react';
import type { Post } from '../types';

function StoryBubble({ story, isFirst }: { story?: typeof stories[0]; isFirst?: boolean }) {
  if (isFirst) {
    return (
      <div className="flex flex-col items-center gap-1.5 cursor-pointer group flex-shrink-0">
        <div className="w-[68px] h-[68px] rounded-full bg-surface-50 border border-dashed border-surface-300 flex items-center justify-center group-hover:border-primary-400 group-hover:bg-primary-50/50 transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-surface-400 group-hover:text-primary-500 transition-colors">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-[11px] text-surface-500 font-medium">Seu story</span>
      </div>
    );
  }
  if (!story) return null;
  return (
    <div className="flex flex-col items-center gap-1.5 cursor-pointer group flex-shrink-0">
      <div className={`w-[68px] h-[68px] rounded-full p-[2.5px] ${story.viewed ? 'bg-surface-200' : 'bg-gradient-to-tr from-primary-500 via-primary-400 to-gold-400'}`}>
        <div className="w-full h-full rounded-full p-[2px] bg-white">
          <img src={story.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
        </div>
      </div>
      <span className="text-[11px] text-surface-600 font-medium truncate max-w-[68px]">{story.user.name.split(' ')[0]}</span>
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
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <article className="bg-white rounded-2xl border border-surface-200/60 shadow-sm hover:shadow-md hover:border-surface-200 transition-all duration-300 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={post.author.avatar} alt="" className="w-11 h-11 rounded-full object-cover ring-1 ring-surface-100" />
            {post.author.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-primary-600 rounded-full flex items-center justify-center ring-2 ring-white">
                <Cross size={8} className="text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-surface-900 text-[13px]">{post.author.name}</h4>
              {post.author.role === 'priest' && (
                <span className="text-[10px] bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded-md font-semibold uppercase tracking-wide">Padre</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-surface-400 mt-0.5">
              <span>{timeAgo(post.createdAt)}</span>
              <span>·</span>
              {post.privacy === 'public' ? <Globe size={11} /> : <Lock size={11} />}
            </div>
          </div>
        </div>
        <button className="p-2 -m-2 rounded-lg hover:bg-surface-100 transition-colors">
          <MoreHorizontal size={16} className="text-surface-400" />
        </button>
      </div>

      {/* Content */}
      <div className="px-5 pb-4">
        <p className="text-surface-700 text-[14px] leading-[1.65] whitespace-pre-line">{post.content}</p>
        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.hashtags.map(tag => (
              <span key={tag} className="text-xs text-primary-600 hover:text-primary-700 cursor-pointer font-medium">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Media */}
      {post.media.length > 0 && (
        <div className="px-5 pb-4">
          {post.media.map(m => (
            <img key={m.id} src={m.url} alt="" className="w-full rounded-xl object-cover max-h-[420px] ring-1 ring-surface-100" />
          ))}
        </div>
      )}

      {/* Prayer Request */}
      {post.prayerRequest && (
        <div className="mx-5 mb-4 p-4 bg-gradient-to-br from-primary-50/80 to-gold-50/50 rounded-xl border border-primary-100/80">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={14} className="text-primary-600" />
            <span className="text-[11px] font-semibold text-primary-700 uppercase tracking-wide">Pedido de Oração</span>
          </div>
          <p className="text-sm text-surface-800 font-medium">{post.prayerRequest.title}</p>
          <p className="text-xs text-surface-500 mt-1">{post.prayerRequest.prayersCount} pessoas rezando</p>
        </div>
      )}

      {/* Divider */}
      <div className="divider-gradient mx-5" />

      {/* Actions */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-1">
          <button onClick={handleLike} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${liked ? 'text-red-500 bg-red-50' : 'text-surface-500 hover:bg-surface-100 hover:text-red-500'}`}>
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            <span className="text-xs font-semibold">{likes}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-primary-600 transition-all">
            <MessageCircle size={16} />
            <span className="text-xs font-semibold">{post.comments}</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-primary-600 transition-all">
            <Share2 size={16} />
            <span className="text-xs font-semibold">{post.shares}</span>
          </button>
        </div>
        <button onClick={() => setSaved(!saved)} className={`p-1.5 rounded-lg transition-all ${saved ? 'text-gold-500 bg-gold-50' : 'text-surface-400 hover:bg-surface-100 hover:text-gold-500'}`}>
          <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Comment Input */}
      {showComments && (
        <div className="px-5 pb-4 pt-1">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Escreva um comentário..."
              className="flex-1 px-4 py-2.5 bg-surface-50 border border-surface-100 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-200 transition-all"
            />
            <button className="p-2.5 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors">
              <Send size={14} />
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

  return (
    <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-5">
      <div className="flex items-start gap-3">
        <img src={user?.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-1 ring-surface-100" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Partilhe algo com sua comunidade..."
            className="w-full resize-none border-none focus:outline-none text-sm text-surface-700 placeholder-surface-400 min-h-[56px] leading-relaxed"
            rows={2}
          />
          <div className="flex items-center justify-between pt-3 border-t border-surface-100">
            <div className="flex items-center gap-0.5">
              {[
                { icon: Image, color: 'hover:text-green-600 hover:bg-green-50', title: 'Imagem' },
                { icon: Video, color: 'hover:text-blue-600 hover:bg-blue-50', title: 'Vídeo' },
                { icon: Smile, color: 'hover:text-gold-600 hover:bg-gold-50', title: 'Emoji' },
                { icon: Heart, color: 'hover:text-red-600 hover:bg-red-50', title: 'Oração' },
                { icon: MapPin, color: 'hover:text-primary-600 hover:bg-primary-50', title: 'Local' },
              ].map((btn, i) => (
                <button key={i} className={`p-2 rounded-lg transition-colors text-surface-400 ${btn.color}`} title={btn.title}>
                  <btn.icon size={16} />
                </button>
              ))}
            </div>
            <button
              disabled={!content.trim()}
              className="px-4 py-2 bg-surface-900 text-white text-xs font-semibold rounded-lg hover:bg-surface-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RightSidebar() {
  const suggestedPeople = users.filter(u => u.id !== 'u1').slice(0, 3);

  return (
    <div className="hidden xl:block w-80 flex-shrink-0 space-y-4">
      {/* Gospel of the Day */}
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <Cross size={14} className="text-primary-600" />
          <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Evangelho do Dia</h3>
        </div>
        <blockquote className="text-sm text-surface-700 leading-relaxed font-serif italic border-l-2 border-primary-200 pl-3">
          "Vinde a mim, todos os que estais cansados e sobrecarregados..."
        </blockquote>
        <p className="text-[11px] text-primary-600 font-semibold mt-2">— Mt 11,28</p>
      </div>

      {/* Suggested People */}
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-5">
        <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Sugestões para você</h3>
        <div className="space-y-3">
          {suggestedPeople.map(person => (
            <div key={person.id} className="flex items-center gap-3">
              <img src={person.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-surface-900 truncate">{person.name}</p>
                <p className="text-[10px] text-surface-400 truncate">{person.followers} seguidores</p>
              </div>
              <button className="px-2.5 py-1 bg-surface-100 text-surface-700 rounded-md text-[10px] font-semibold hover:bg-surface-200 transition-colors">
                Seguir
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-5">
        <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Próximos eventos</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-surface-900 leading-none">19</span>
              <span className="text-[8px] text-surface-500 font-semibold uppercase">Jan</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-surface-900 truncate">Missa Dominical</p>
              <p className="text-[10px] text-surface-400">09:00 · Paróquia N. S. Aparecida</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-surface-900 leading-none">17</span>
              <span className="text-[8px] text-surface-500 font-semibold uppercase">Jan</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-surface-900 truncate">Adoração ao Santíssimo</p>
              <p className="text-[10px] text-surface-400">19:30 · Capela do Santíssimo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-2 pt-2">
        <p className="text-[10px] text-surface-400 leading-relaxed">
          Lumen © 2025 · Termos · Privacidade · Sobre
        </p>
      </div>
    </div>
  );
}

export default function FeedPage() {
  return (
    <div className="max-w-[1200px] mx-auto flex gap-6">
      <div className="flex-1 max-w-2xl space-y-5">
        {/* Stories */}
        <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-4">
          <div className="flex items-center gap-5 overflow-x-auto pb-1 scrollbar-hide">
            <StoryBubble isFirst />
            {stories.map(story => (
              <StoryBubble key={story.id} story={story} />
            ))}
          </div>
        </div>

        {/* Create Post */}
        <CreatePost />

        {/* Posts */}
        {posts.map((post, i) => (
          <div key={post.id} style={{ animationDelay: `${i * 50}ms` }}>
            <PostCard post={post} />
          </div>
        ))}

        {/* Load More */}
        <div className="text-center py-6">
          <button className="px-6 py-2.5 bg-white border border-surface-200 rounded-xl text-xs font-semibold text-surface-600 hover:bg-surface-50 hover:border-surface-300 transition-all shadow-sm">
            Carregar mais
        </button>
        </div>
      </div>
      <RightSidebar />
    </div>
  );
}
