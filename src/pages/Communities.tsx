import React, { useState } from 'react';
import { communities } from '../data/mockData';
import { Users, Lock, Globe, Building, Search, Plus } from 'lucide-react';

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
      case 'public': return <Globe size={12} />;
      case 'private': return <Lock size={12} />;
      case 'institutional': return <Building size={12} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-surface-900 tracking-tight">Comunidades</h1>
          <p className="text-surface-500 text-sm mt-1.5">Encontre e participe de comunidades de fé</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-900 text-white rounded-xl text-xs font-semibold hover:bg-surface-800 transition-colors shadow-sm">
          <Plus size={14} />
          Criar comunidade
        </button>
      </div>

      {/* Search & Filters */}
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

      {/* Communities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(community => (
          <div key={community.id} className="bg-white rounded-2xl border border-surface-200/60 shadow-sm overflow-hidden card-hover group cursor-pointer">
            {/* Cover */}
            <div className="relative h-24 bg-gradient-to-br from-surface-800 to-surface-900">
              <img src={community.cover} alt="" className="w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4 -mt-6 relative">
              <div className="flex items-start gap-3">
                <img
                  src={community.image}
                  alt={community.name}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md"
                />
                <div className="flex-1 min-w-0 pt-5">
                  <h3 className="font-semibold text-surface-900 text-sm truncate group-hover:text-primary-700 transition-colors">
                    {community.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-surface-400">
                    {getTypeIcon(community.type)}
                    <span className="capitalize">{community.type}</span>
                    <span>·</span>
                    <span>{community.category}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-surface-500 mt-3 line-clamp-2 leading-relaxed">{community.description}</p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-100">
                <div className="flex items-center gap-3 text-xs text-surface-500">
                  <span className="flex items-center gap-1 font-medium"><Users size={12} /> {community.members.toLocaleString()}</span>
                </div>
                <button className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  community.joined
                    ? 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    : 'bg-surface-900 text-white hover:bg-surface-800'
                }`}>
                  {community.joined ? 'Membro' : 'Participar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Users size={40} className="mx-auto mb-3 text-surface-300" />
          <p className="text-surface-500 text-sm">Nenhuma comunidade encontrada</p>
        </div>
      )}
    </div>
  );
}
