import React, { useState } from 'react';
import { communities } from '../data/mockData';
import { Users, Lock, Globe, Building, Search, Plus, Filter } from 'lucide-react';

const categories = ['Todas', 'Juventude', 'Formação', 'Comunicação', 'Oração', 'Família', 'Liturgia', 'Música'];

export default function CommunitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = communities.filter(c => {
    const matchesCategory = selectedCategory === 'Todas' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'public': return <Globe size={14} />;
      case 'private': return <Lock size={14} />;
      case 'institutional': return <Building size={14} />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'public': return 'Pública';
      case 'private': return 'Privada';
      case 'institutional': return 'Institucional';
      default: return '';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 lg:pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-800">Comunidades</h1>
          <p className="text-surface-500 text-sm mt-1">Encontre e participe de comunidades de fé</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all shadow-sm">
          <Plus size={16} />
          Criar comunidade
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar comunidades..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(community => (
          <div key={community.id} className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
            {/* Cover */}
            <div className="relative h-28 bg-gradient-to-br from-primary-400 to-primary-700">
              <img src={community.cover} alt="" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4 -mt-8 relative">
              <div className="flex items-start gap-3">
                <img
                  src={community.image}
                  alt={community.name}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md"
                />
                <div className="flex-1 min-w-0 pt-6">
                  <h3 className="font-semibold text-surface-800 text-sm truncate group-hover:text-primary-700 transition-colors">
                    {community.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-xs text-surface-500">
                      {getTypeIcon(community.type)} {getTypeLabel(community.type)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-surface-500 mt-2 line-clamp-2">{community.description}</p>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-100">
                <div className="flex items-center gap-3 text-xs text-surface-500">
                  <span className="flex items-center gap-1"><Users size={12} /> {community.members.toLocaleString()}</span>
                  <span>{community.posts} posts</span>
                </div>
                <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  community.joined
                    ? 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}>
                  {community.joined ? 'Membro' : 'Participar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto mb-3 text-surface-300" />
          <p className="text-surface-500">Nenhuma comunidade encontrada</p>
        </div>
      )}
    </div>
  );
}
