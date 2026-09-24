import React, { useState } from 'react';
import { events } from '../data/mockData';
import { Calendar, MapPin, Clock, Users, Church, Search, Plus } from 'lucide-react';

const eventTypes = [
  { id: 'all', label: 'Todos' },
  { id: 'mass', label: 'Missa' },
  { id: 'adoration', label: 'Adoração' },
  { id: 'retreat', label: 'Retiro' },
  { id: 'catechesis', label: 'Catequese' },
  { id: 'formation', label: 'Formação' },
  { id: 'novena', label: 'Novena' },
];

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    mass: 'bg-amber-50 text-amber-700 border-amber-200',
    adoration: 'bg-purple-50 text-purple-700 border-purple-200',
    retreat: 'bg-blue-50 text-blue-700 border-blue-200',
    catechesis: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    formation: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    novena: 'bg-rose-50 text-rose-700 border-rose-200',
    procession: 'bg-orange-50 text-orange-700 border-orange-200',
    meeting: 'bg-slate-50 text-slate-700 border-slate-200',
    other: 'bg-zinc-50 text-zinc-700 border-zinc-200',
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-surface-900 tracking-tight">Eventos</h1>
          <p className="text-surface-500 text-sm mt-1.5">Missas, retiros, formações e celebrações</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-900 text-white rounded-xl text-xs font-semibold hover:bg-surface-800 transition-colors shadow-sm">
          <Plus size={14} />
          Criar evento
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar eventos..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-surface-200/80 rounded-xl text-sm focus:outline-none focus:border-surface-300 focus:shadow-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {eventTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedType === type.id
                  ? 'bg-surface-900 text-white'
                  : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200/80'
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
          <div key={event.id} className="bg-white rounded-2xl border border-surface-200/60 shadow-sm overflow-hidden card-hover group">
            {/* Image */}
            <div className="relative h-44">
              <img src={event.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border uppercase tracking-wide ${getTypeColor(event.type)}`}>
                  {getTypeLabel(event.type)}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-serif font-semibold text-lg leading-tight">{event.title}</h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-sm text-surface-600 line-clamp-2 leading-relaxed mb-4">{event.description}</p>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex items-center gap-2 text-xs text-surface-600">
                  <Calendar size={13} className="text-surface-400" />
                  <span className="truncate">{new Date(event.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-surface-600">
                  <Clock size={13} className="text-surface-400" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-surface-600 col-span-2">
                  <MapPin size={13} className="text-surface-400" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-100">
                <span className="text-xs text-surface-500 font-medium">{event.participants} confirmados</span>
                <button className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  event.going
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-surface-900 text-white hover:bg-surface-800'
                }`}>
                  {event.going ? '✓ Confirmado' : 'Participar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Calendar size={40} className="mx-auto mb-3 text-surface-300" />
          <p className="text-surface-500 text-sm">Nenhum evento encontrado</p>
        </div>
      )}
    </div>
  );
}
