import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import * as localDb from '../lib/localDatabase';
import { MapPin, Church, Calendar, Edit3, Users, Cross, FileText } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('about');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    if (profile) {
      setEditData({
        full_name: profile.full_name,
        bio: profile.bio,
        city: profile.city,
        parish: profile.parish,
        diocese: profile.diocese,
      });
    }
  }, [profile]);

  if (!user || !profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-surface-200/60 p-8 text-center">
          <p className="text-surface-500">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    await updateProfile(editData);
    setEditing(false);
  };

  const tabs = [
    { id: 'about' as const, label: 'Sobre', icon: Users },
    { id: 'posts' as const, label: 'Publicações', icon: FileText },
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
        </div>

        {/* Profile Info */}
        <div className="relative px-5 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16">
            <div className="relative">
              <img
                src={profile.avatar_url || profile.avatar || ''}
                alt={profile.full_name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-xl bg-surface-100"
              />
            </div>
            <div className="flex-1 sm:pb-2">
              {editing ? (
                <input
                  type="text"
                  value={editData.full_name || ''}
                  onChange={e => setEditData({ ...editData, full_name: e.target.value })}
                  className="text-2xl font-serif font-semibold text-surface-900 bg-transparent border-b border-surface-300 focus:outline-none focus:border-primary-500 w-full"
                />
              ) : (
                <h1 className="text-2xl font-serif font-semibold text-surface-900 tracking-tight">{profile.full_name}</h1>
              )}
              <p className="text-surface-400 text-sm mt-0.5">@{profile.username}</p>
              
              {editing ? (
                <textarea
                  value={editData.bio || ''}
                  onChange={e => setEditData({ ...editData, bio: e.target.value })}
                  className="w-full mt-3 p-2 bg-surface-50 rounded-lg text-sm border border-surface-200 focus:outline-none focus:border-primary-400"
                  rows={2}
                  placeholder="Conte um pouco sobre você..."
                />
              ) : (
                <p className="text-surface-600 text-sm mt-3 leading-relaxed max-w-lg">{profile.bio || 'Nenhuma biografia ainda.'}</p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-surface-500">
                {editing ? (
                  <>
                    <input
                      type="text"
                      value={editData.city || ''}
                      onChange={e => setEditData({ ...editData, city: e.target.value })}
                      placeholder="Cidade"
                      className="px-2 py-1 bg-surface-50 rounded border border-surface-200 text-xs"
                    />
                    <input
                      type="text"
                      value={editData.parish || ''}
                      onChange={e => setEditData({ ...editData, parish: e.target.value })}
                      placeholder="Paróquia"
                      className="px-2 py-1 bg-surface-50 rounded border border-surface-200 text-xs"
                    />
                  </>
                ) : (
                  <>
                    {profile.city && <span className="flex items-center gap-1.5"><MapPin size={12} /> {profile.city}</span>}
                    {profile.parish && <span className="flex items-center gap-1.5"><Church size={12} /> {profile.parish}</span>}
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(profile.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                  </>
                )}
              </div>
            </div>
            
            {editing ? (
              <div className="flex gap-2 self-start sm:self-end">
                <button onClick={() => setEditing(false)} className="px-4 py-2.5 bg-surface-100 rounded-xl text-xs font-semibold text-surface-700 hover:bg-surface-200">
                  Cancelar
                </button>
                <button onClick={handleSave} className="px-4 py-2.5 bg-surface-900 rounded-xl text-xs font-semibold text-white hover:bg-surface-800">
                  Salvar
                </button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2.5 bg-surface-900 hover:bg-surface-800 rounded-xl text-xs font-semibold text-white transition-colors self-start sm:self-end shadow-sm">
                <Edit3 size={12} />
                Editar perfil
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-6 pt-5 border-t border-surface-100">
            {[
              { value: profile.friends_count || 0, label: 'Amigos' },
              { value: profile.followers_count || 0, label: 'Seguidores' },
              { value: profile.following_count || 0, label: 'Seguindo' },
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
          {activeTab === 'about' && (
            <div className="space-y-8 max-w-xl">
              <div>
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Devoções</h3>
                <div className="flex flex-wrap gap-2">
                  {(profile.devotions || []).length > 0 ? (
                    profile.devotions.map((d: string) => (
                      <span key={d} className="px-3 py-1.5 bg-surface-100 text-surface-700 text-xs rounded-lg font-medium">
                        {d}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-surface-400">Nenhuma devoção cadastrada</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Pastorais</h3>
                <div className="flex flex-wrap gap-2">
                  {(profile.pastorals || []).length > 0 ? (
                    profile.pastorals.map((p: string) => (
                      <span key={p} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-xs rounded-lg font-medium">
                        {p}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-surface-400">Nenhuma pastoral cadastrada</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Informações</h3>
                <div className="space-y-2.5 text-sm text-surface-600">
                  {profile.city && <p className="flex items-center gap-2.5"><MapPin size={14} className="text-surface-400" /> {profile.city}</p>}
                  {profile.parish && <p className="flex items-center gap-2.5"><Church size={14} className="text-surface-400" /> {profile.parish}</p>}
                  {profile.diocese && <p className="flex items-center gap-2.5"><Cross size={14} className="text-surface-400" /> {profile.diocese}</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="text-center py-12 text-surface-400">
              <FileText size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Suas publicações aparecerão aqui</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
