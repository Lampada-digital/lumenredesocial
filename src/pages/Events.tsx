import React, { useState } from 'react';
import { events } from '../data/mockData';
import {
  Calendar, MapPin, Clock, Users, Church, Search,
  Plus, Filter, ChevronRight, Heart, Star
} from 'lucide-react';

const eventTypes = [
  { id: 'all', label: 'Todos', color: 'bg-surface-100 text-surface-700' },
  { id: 'mass', label: 'Missa', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'adoration', label: 'Adoração', color: 'bg-purple-100 text-purple-700' },
  { id: 'retreat', label: 'Retiro', color: 'bg-blue-100 text-blue-700' },
  { id: 'catechesis', label: 'Catequese', color: 'bg-green-100 text-green-700' },
  { id: 'formation', label: 'Formação', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'novena', label: 'Novena', color: 'bg-rose-100 text-rose-700' },
  { id: 'other', label: 'Outros', color: 'bg-gray-100 text-gray-700' },
];

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    mass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    adoration: 'bg-purple-100 text-purple-800 border-purple-200',
    retreat: 'bg-blue-100 text-blue-800 border-blue-200',
    catechesis: 'bg-green-100 text-green-800 border-green-200',
    formation: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    novena: 'bg-rose-100 text-rose-800 border-rose-200',
    procession: 'bg-amber-100 text-amber-800 border-amber-200',
    meeting: 'bg-slate-100 text-slate-800 border-slate-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[type] || colors.other;
};

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    mass: 'Missa', adoration: 'Adoração', retreat: 'Retiro',
    catechesis: 'Catequese', formation: 'Formação', novena: 'Novena',
    procession: 'Procissão', meeting: 'Reunião', other: 'Evento',
  };
  return labels[type] || 'Evento';
};

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = events.filter(e => {
    const matchesType = selectedType === 'all' || e.type === selectedType;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 lg:pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-800">Eventos</h1>
          <p className="text-surface-500 text-sm mt-1">Missas, retiros, formações e mais</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all shadow-sm">
          <Plus size={16} />
          Criar evento
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar eventos..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {eventTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedType === type.id
                  ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-200'
                  : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(event => (
          <div key={event.id} className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
            {/* Image */}
            <div className="relative h-40">
              <img src={event.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getTypeColor(event.type)}`}>
                  {getTypeLabel(event.type)}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white font-bold text-lg">{event.title}</h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-sm text-surface-600 line-clamp-2 mb-3">{event.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-surface-600">
                  <Calendar size={14} className="text-primary-500" />
                  <span>{new Date(event.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-surface-600">
                  <Clock size={14} className="text-primary-500" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-surface-600">
                  <MapPin size={14} className="text-primary-500" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-surface-600">
                  <Church size={14} className="text-primary-500" />
                  <span className="truncate">{event.parish}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-100">
                <div className="flex items-center gap-3 text-xs text-surface-500">
                  <span className="flex items-center gap-1"><Users size={12} /> {event.participants} indo</span>
                  <span className="flex items-center gap-1"><Heart size={12} /> {event.interested} interessados</span>
                </div>
                <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  event.going
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}>
                  {event.going ? '✓ Confirmado' : 'Participar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto mb-3 text-surface-300" />
          <p className="text-surface-500">Nenhum evento encontrado</p>
        </div>
      )}
    </div>
  );
}
