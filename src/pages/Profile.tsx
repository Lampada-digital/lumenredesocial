import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { posts } from '../data/mockData';
import {
  MapPin, Church, Calendar, Edit3, Camera, Settings,
  Users, Heart, BookOpen, Cross, Grid, Bookmark, FileText
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends' | 'photos'>('posts');

  if (!user) return null;

  const userPosts = posts.filter(p => p.author.id === user.id);

  const tabs = [
    { id: 'posts' as const, label: 'Publicações', icon: FileText },
    { id: 'about' as const, label: 'Sobre', icon: BookOpen },
    { id: 'friends' as const, label: 'Amigos', icon: Users },
    { id: 'photos' as const, label: 'Fotos', icon: Camera },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20 lg:pb-4">
      {/* Cover */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="relative h-48 sm:h-64 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 rounded-full" />
            <div className="absolute bottom-10 right-20 w-48 h-48 border border-white/20 rounded-full" />
          </div>
          <button className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-sm rounded-lg text-white hover:bg-black/50 transition-colors">
            <Camera size={16} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="relative px-4 sm:px-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-1 right-1 p-1.5 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition-colors">
                <Camera size={12} />
              </button>
            </div>
            <div className="flex-1 sm:pb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-surface-800">{user.name}</h1>
              </div>
              <p className="text-surface-500 text-sm">@{user.username}</p>
              <p className="text-surface-600 text-sm mt-2 max-w-lg">{user.bio}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-surface-500">
                <span className="flex items-center gap-1"><MapPin size={12} /> {user.city}</span>
                <span className="flex items-center gap-1"><Church size={12} /> {user.parish}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Desde {new Date(user.joinedAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-100 hover:bg-surface-200 rounded-xl text-sm font-medium text-surface-700 transition-colors self-start sm:self-end">
              <Edit3 size={14} />
              Editar perfil
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-surface-100">
            <div className="text-center">
              <p className="text-lg font-bold text-surface-800">{user.friends}</p>
              <p className="text-xs text-surface-500">Amigos</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-surface-800">{user.followers}</p>
              <p className="text-xs text-surface-500">Seguidores</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-surface-800">{user.following}</p>
              <p className="text-xs text-surface-500">Seguindo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm">
        <div className="flex border-b border-surface-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-surface-500 hover:text-surface-700'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {userPosts.length > 0 ? (
                userPosts.map(post => (
                  <div key={post.id} className="p-4 bg-surface-50 rounded-xl border border-surface-100">
                    <p className="text-sm text-surface-700 whitespace-pre-line">{post.content.slice(0, 200)}...</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-surface-500">
                      <span className="flex items-center gap-1"><Heart size={12} /> {post.likes}</span>
                      <span className="flex items-center gap-1">💬 {post.comments}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-surface-400">
                  <FileText size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Nenhuma publicação ainda</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-surface-800 mb-2">Sobre mim</h3>
                <p className="text-sm text-surface-600">{user.bio}</p>
              </div>
              <div>
                <h3 className="font-semibold text-surface-800 mb-2">Devoções e Santos</h3>
                <div className="flex flex-wrap gap-2">
                  {user.devotions.map(d => (
                    <span key={d} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-xs rounded-lg font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-surface-800 mb-2">Pastorais</h3>
                <div className="flex flex-wrap gap-2">
                  {user.pastorals.map(p => (
                    <span key={p} className="px-3 py-1.5 bg-gold-50 text-gold-700 text-xs rounded-lg font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-surface-800 mb-2">Informações</h3>
                <div className="space-y-2 text-sm text-surface-600">
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-surface-400" /> {user.city}</p>
                  <p className="flex items-center gap-2"><Church size={14} className="text-surface-400" /> {user.parish}</p>
                  <p className="flex items-center gap-2"><Cross size={14} className="text-surface-400" /> {user.diocese}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center p-3 bg-surface-50 rounded-xl border border-surface-100">
                  <div className="w-16 h-16 rounded-full bg-surface-200 mb-2" />
                  <p className="text-xs font-medium text-surface-700 text-center">Amigo {i + 1}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-surface-100 border border-surface-200" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
