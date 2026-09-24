import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import * as localDb from '../lib/localDatabase';
import { fetchCommunities, joinCommunity, leaveCommunity, checkCommunityMembership } from '../lib/database';
import { Users, Search } from 'lucide-react';

const categories = ['Todas', 'Juventude', 'Formação', 'Comunicação', 'Oração', 'Família', 'Liturgia', 'Música'];

export default function CommunitiesPage() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    if (isSupabaseConfigured) {
      const data = await fetchCommunities(50);
      setCommunities(data);

      if (user) {
        const checks = await Promise.all(
          data.map(c => checkCommunityMembership(c.id, user.id))
        );
        const memberOf = new Set(data.filter((_, i) => checks[i]).map(c => c.id));
        setMemberships(memberOf);
      }
    } else {
      // Modo local
      const data = localDb.getCommunities();
      setCommunities(data);

      if (user) {
        const memberOf = new Set(
          data.filter(c => localDb.isMember(c.id, user.id)).map(c => c.id)
        );
        setMemberships(memberOf);
      }
    }

    setLoading(false);
  };

  const handleJoin = async (communityId: string) => {
    if (!user) return;

    if (isSupabaseConfigured) {
      if (memberships.has(communityId)) {
        await leaveCommunity(communityId, user.id);
        setMemberships(prev => {
          const next = new Set(prev);
          next.delete(communityId);
          return next;
        });
      } else {
        await joinCommunity(communityId, user.id);
        setMemberships(prev => new Set(prev).add(communityId));
      }
    } else {
      // Modo local
      if (memberships.has(communityId)) {
        localDb.leaveCommunity(communityId, user.id);
        setMemberships(prev => {
          const next = new Set(prev);
          next.delete(communityId);
          return next;
        });
        // Atualiza lista
        const data = localDb.getCommunities();
        setCommunities(data);
      } else {
        localDb.joinCommunity(communityId, user.id);
        setMemberships(prev => new Set(prev).add(communityId));
        // Atualiza lista
        const data = localDb.getCommunities();
        setCommunities(data);
      }
    }
  };

  const filtered = communities.filter(c => {
    const matchesCategory = selectedCategory === 'Todas' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl border border-surface-200/60 p-8 text-center">
          <div className="w-8 h-8 border-2 border-surface-300 border-t-primary-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-surface-500 mt-3">Carregando comunidades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-surface-900 tracking-tight">Comunidades</h1>
          <p className="text-surface-500 text-sm mt-1.5">Encontre e participe de comunidades de fé</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar comunidades..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-surface-200/80 rounded-xl text-sm focus:outline-none focus:border-surface-300 focus:shadow-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-surface-900 text-white'
                  : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-200/60 p-12 text-center">
          <Users size={40} className="mx-auto mb-3 text-surface-300" />
          <p className="text-surface-500 text-sm">Nenhuma comunidade encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(community => (
            <div key={community.id} className="bg-white rounded-2xl border border-surface-200/60 shadow-sm overflow-hidden card-hover group cursor-pointer">
              <div className="relative h-24 bg-gradient-to-br from-surface-800 to-surface-900">
                {community.cover_url && <img src={community.cover_url} alt="" className="w-full h-full object-cover opacity-70" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <div className="p-4">
                <div className="flex items-start gap-3 -mt-10 relative">
                  <img
                    src={community.image_url || ''}
                    alt={community.name}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md bg-surface-100"
                  />
                  <div className="flex-1 min-w-0 pt-6">
                    <h3 className="font-semibold text-surface-900 text-sm truncate">{community.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-surface-400">
                      <span className="capitalize">{community.type}</span>
                      <span>·</span>
                      <span>{community.category}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-surface-500 mt-3 line-clamp-2 leading-relaxed">{community.description}</p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-100">
                  <div className="flex items-center gap-1.5 text-xs text-surface-500">
                    <Users size={12} />
                    <span className="font-medium">{community.members_count}</span>
                  </div>
                  <button
                    onClick={() => handleJoin(community.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      memberships.has(community.id)
                        ? 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                        : 'bg-surface-900 text-white hover:bg-surface-800'
                    }`}
                  >
                    {memberships.has(community.id) ? 'Membro' : 'Participar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
