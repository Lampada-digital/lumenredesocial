import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { posts } from '../data/mockData';
import {
  MapPin, Church, Calendar, Edit3, Camera,
  Users, Heart, Cross, FileText, Image
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends' | 'photos'>('posts');

  if (!user) return null;

  const userPosts = posts.filter(p => p.author.id === user.id);

  const tabs = [
    { id: 'posts' as const, label: 'Publicações', icon: FileText },
    { id: 'about' as const, label: 'Sobre', icon: Users },
    { id: 'friends' as const, label: 'Amigos', icon: Users },
    { id: 'photos' as const, label: 'Mídia', icon: Image },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Cover + Profile */}
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="relative h-52 sm:h-72 bg-gradient-to-br from-surface-900 via-primary-900 to-surface-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-64 h-64 border border-white/10 rounded-full" />
            <div className="absolute bottom-0 right-0 w-96 h-96 border border-white/5 rounded-full" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <button className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-sm rounded-lg text-white/80 hover:text-white hover:bg-black/40 transition-all">
            <Camera size={14} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="relative px-5 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-xl"
              />
              <button className="absolute bottom-2 right-2 p-1.5 bg-surface-900 rounded-lg text-white hover:bg-surface-800 transition-colors">
                <Camera size={10} />
              </button>
            </div>
            <div className="flex-1 sm:pb-2">
              <h1 className="text-2xl font-serif font-semibold text-surface-900 tracking-tight">{user.name}</h1>
              <p className="text-surface-400 text-sm mt-0.5">@{user.username}</p>
              <p className="text-surface-600 text-sm mt-3 leading-relaxed max-w-lg">{user.bio}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-surface-500">
                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-surface-400" /> {user.city}</span>
                <span className="flex items-center gap-1.5"><Church size={12} className="text-surface-400" /> {user.parish}</span>
                <span className="flex items-center gap-1.5"><Calendar size={12} className="text-surface-400" /> {new Date(user.joinedAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-900 hover:bg-surface-800 rounded-xl text-xs font-semibold text-white transition-colors self-start sm:self-end shadow-sm">
              <Edit3 size={12} />
              Editar perfil
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-6 pt-5 border-t border-surface-100">
            {[
              { value: user.friends, label: 'Amigos' },
              { value: user.followers, label: 'Seguidores' },
              { value: user.following, label: 'Seguindo' },
            ].map((stat, i) => (
              <div key={i} className="text-center sm:text-left">
                <p className="text-xl font-semibold text-surface-900">{stat.value}</p>
                <p className="text-xs text-surface-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm overflow-hidden">
        <div className="flex border-b border-surface-100 px-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-4 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-surface-900 text-surface-900'
                  : 'border-transparent text-surface-400 hover:text-surface-600'
              }`}
            >
              <tab.icon size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {userPosts.length > 0 ? (
                userPosts.map(post => (
                  <div key={post.id} className="p-4 bg-surface-50/80 rounded-xl border border-surface-100 hover:border-surface-200 transition-colors">
                    <p className="text-sm text-surface-700 leading-relaxed whitespace-pre-line line-clamp-3">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-surface-400">
                      <span className="flex items-center gap-1"><Heart size={11} /> {post.likes}</span>
                      <span>💬 {post.comments}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-surface-400">
                  <FileText size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Nenhuma publicação ainda</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-8 max-w-xl">
              <div>
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Sobre</h3>
                <p className="text-sm text-surface-700 leading-relaxed">{user.bio}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Devoções</h3>
                <div className="flex flex-wrap gap-2">
                  {user.devotions.map(d => (
                    <span key={d} className="px-3 py-1.5 bg-surface-100 text-surface-700 text-xs rounded-lg font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Pastorais</h3>
                <div className="flex flex-wrap gap-2">
                  {user.pastorals.map(p => (
                    <span key={p} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-xs rounded-lg font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Informações</h3>
                <div className="space-y-2.5 text-sm text-surface-600">
                  <p className="flex items-center gap-2.5"><MapPin size={14} className="text-surface-400" /> {user.city}</p>
                  <p className="flex items-center gap-2.5"><Church size={14} className="text-surface-400" /> {user.parish}</p>
                  <p className="flex items-center gap-2.5"><Cross size={14} className="text-surface-400" /> {user.diocese}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center p-4 bg-surface-50/80 rounded-xl border border-surface-100 hover:border-surface-200 transition-colors cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-surface-200 mb-2.5" />
                  <p className="text-xs font-medium text-surface-700 text-center">Amigo {i + 1}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-surface-100 border border-surface-100" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
