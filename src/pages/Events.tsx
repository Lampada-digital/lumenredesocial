import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import * as localDb from '../lib/localDatabase';
import { fetchEvents, joinEvent } from '../lib/database';
import { Calendar, MapPin, Clock, Search, Plus, X } from 'lucide-react';

const eventTypes = [
  { id: 'all', label: 'Todos' },
  { id: 'mass', label: 'Missa' },
  { id: 'adoration', label: 'Adoração' },
  { id: 'retreat', label: 'Retiro' },
  { id: 'catechesis', label: 'Catequese' },
  { id: 'formation', label: 'Formação' },
];

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'mass',
    event_date: '',
    event_time: '',
    location: '',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    if (isSupabaseConfigured) {
      const data = await fetchEvents(50);
      setEvents(data);
    } else {
      const data = localDb.getEvents();
      setEvents(data);
    }
    setLoading(false);
  };

  const handleJoin = async (eventId: string) => {
    if (!user) return;

    if (isSupabaseConfigured) {
      await joinEvent(eventId, user.id, 'going');
    } else {
      localDb.joinEvent(eventId, user.id);
      const data = localDb.getEvents();
      setEvents(data);
    }
  };

  const handleCreateEvent = async () => {
    if (!user || !newEvent.title.trim() || !newEvent.description.trim() || !newEvent.event_date || !newEvent.event_time || !newEvent.location.trim()) return;

    if (isSupabaseConfigured) {
      // TODO: Implementar criação via Supabase
      console.log('Criar evento via Supabase');
    } else {
      // Modo local
      const event = localDb.createEvent({
        title: newEvent.title,
        description: newEvent.description,
        type: newEvent.type,
        event_date: newEvent.event_date,
        event_time: newEvent.event_time,
        location: newEvent.location,
        organizer_id: user.id,
      });
      setEvents([event, ...events]);
    }

    setNewEvent({ title: '', description: '', type: 'mass', event_date: '', event_time: '', location: '' });
    setShowCreateModal(false);
    loadEvents();
  };

  const filtered = events.filter(e => {
    const matchesType = selectedType === 'all' || e.type === selectedType;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl border border-surface-200/60 p-8 text-center">
          <div className="w-8 h-8 border-2 border-surface-300 border-t-primary-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-surface-500 mt-3">Carregando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-surface-900 tracking-tight">Eventos</h1>
          <p className="text-surface-500 text-sm mt-1.5">Missas, retiros, formações e celebrações</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-surface-900 text-white rounded-xl text-xs font-semibold hover:bg-surface-800 transition-colors shadow-sm"
        >
          <Plus size={14} />
          Criar evento
        </button>
      </div>

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

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-200/60 p-12 text-center">
          <Calendar size={40} className="mx-auto mb-3 text-surface-300" />
          <p className="text-surface-500 text-sm">Nenhum evento encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(event => (
            <div key={event.id} className="bg-white rounded-2xl border border-surface-200/60 shadow-sm overflow-hidden card-hover group">
              <div className="relative h-44 bg-gradient-to-br from-primary-600 to-primary-800">
                {event.image_url && <img src={event.image_url} alt="" className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-serif font-semibold text-lg leading-tight">{event.title}</h3>
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm text-surface-600 line-clamp-2 leading-relaxed mb-4">{event.description}</p>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2 text-xs text-surface-600">
                    <Calendar size={13} className="text-surface-400" />
                    <span className="truncate">{new Date(event.event_date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-surface-600">
                    <Clock size={13} className="text-surface-400" />
                    <span>{event.event_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-surface-600 col-span-2">
                    <MapPin size={13} className="text-surface-400" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-100">
                  <span className="text-xs text-surface-500 font-medium">{event.participants_count} confirmados</span>
                  <button
                    onClick={() => handleJoin(event.id)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-surface-900 text-white hover:bg-surface-800 transition-colors"
                  >
                    Participar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criar Evento */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-semibold text-surface-900">Criar Evento</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5 uppercase tracking-wide">
                  Título do Evento *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Ex: Missa Dominical"
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5 uppercase tracking-wide">
                  Descrição *
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Descreva o evento..."
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5 uppercase tracking-wide">
                  Tipo de Evento
                </label>
                <select
                  value={newEvent.type}
                  onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all"
                >
                  <option value="mass">Missa</option>
                  <option value="adoration">Adoração</option>
                  <option value="retreat">Retiro</option>
                  <option value="catechesis">Catequese</option>
                  <option value="formation">Formação</option>
                  <option value="novena">Novena</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5 uppercase tracking-wide">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={newEvent.event_date}
                    onChange={e => setNewEvent({ ...newEvent, event_date: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5 uppercase tracking-wide">
                    Horário *
                  </label>
                  <input
                    type="time"
                    value={newEvent.event_time}
                    onChange={e => setNewEvent({ ...newEvent, event_time: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5 uppercase tracking-wide">
                  Local *
                </label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Ex: Paróquia Nossa Senhora Aparecida"
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-surface-100 text-surface-700 rounded-xl text-sm font-semibold hover:bg-surface-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateEvent}
                  disabled={!newEvent.title.trim() || !newEvent.description.trim() || !newEvent.event_date || !newEvent.event_time || !newEvent.location.trim()}
                  className="flex-1 px-4 py-3 bg-surface-900 text-white rounded-xl text-sm font-semibold hover:bg-surface-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
