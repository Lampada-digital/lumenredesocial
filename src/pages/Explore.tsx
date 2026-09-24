import React from 'react';
import { users, communities, events } from '../data/mockData';
import { Users, Calendar, TrendingUp, Cross, Church } from 'lucide-react';

export default function ExplorePage() {
  const suggestedUsers = users.filter(u => u.id !== 'u1').slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-semibold text-surface-900 tracking-tight">Explorar</h1>
        <p className="text-surface-500 text-sm mt-1.5">Descubra pessoas, comunidades e eventos</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Users, label: 'Comunidades', count: '12.5k', gradient: 'from-primary-600 to-primary-800' },
          { icon: Calendar, label: 'Eventos', count: '3.2k', gradient: 'from-blue-600 to-blue-800' },
          { icon: Church, label: 'Paróquias', count: '890', gradient: 'from-gold-600 to-gold-800' },
          { icon: TrendingUp, label: 'Em alta', count: '156', gradient: 'from-emerald-600 to-emerald-800' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-surface-200/60 p-5 card-hover cursor-pointer group">
            <div className={`w-11 h-11 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-surface-900/10 group-hover:scale-105 transition-transform`}>
              <item.icon size={18} className="text-white" />
            </div>
            <p className="font-semibold text-surface-900 text-sm">{item.label}</p>
            <p className="text-xs text-surface-500 mt-0.5">{item.count} ativos</p>
          </div>
        ))}
      </div>

      {/* Suggested People */}
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-semibold text-surface-900">Pessoas sugeridas</h2>
          <button className="text-xs text-primary-600 hover:text-primary-700 font-semibold">Ver todas</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestedUsers.map(user => (
            <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors cursor-pointer">
              <div className="relative flex-shrink-0">
                <img src={user.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
                {user.verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center ring-2 ring-white">
                    <Cross size={8} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-surface-900 truncate">{user.name}</h4>
                <p className="text-xs text-surface-500 truncate">{user.bio}</p>
                <p className="text-[11px] text-surface-400 mt-0.5 font-medium">{user.followers} seguidores</p>
              </div>
              <button className="px-3 py-1.5 bg-surface-900 text-white rounded-lg text-[11px] font-semibold hover:bg-surface-800 transition-colors flex-shrink-0">
                Seguir
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Communities */}
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-semibold text-surface-900">Comunidades em destaque</h2>
          <button className="text-xs text-primary-600 hover:text-primary-700 font-semibold">Ver todas</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {communities.slice(0, 4).map(community => (
            <div key={community.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors cursor-pointer">
              <img src={community.image} alt="" className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-surface-900 truncate">{community.name}</h4>
                <p className="text-xs text-surface-500">{community.members.toLocaleString()} membros</p>
              </div>
              <button className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors flex-shrink-0 ${
                community.joined
                  ? 'bg-surface-100 text-surface-600'
                  : 'bg-surface-900 text-white hover:bg-surface-800'
              }`}>
                {community.joined ? 'Membro' : 'Participar'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-semibold text-surface-900">Próximos eventos</h2>
          <button className="text-xs text-primary-600 hover:text-primary-700 font-semibold">Ver todos</button>
        </div>
        <div className="space-y-2">
          {events.slice(0, 3).map(event => (
            <div key={event.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-surface-100 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-surface-900 leading-none">{new Date(event.date).getDate()}</span>
                <span className="text-[9px] text-surface-500 font-semibold uppercase mt-0.5">{new Date(event.date).toLocaleDateString('pt-BR', { month: 'short' })}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-surface-900 truncate">{event.title}</h4>
                <p className="text-xs text-surface-500 mt-0.5">{event.time} · {event.location}</p>
              </div>
              <button className="px-3 py-1.5 bg-surface-100 text-surface-700 rounded-lg text-[11px] font-semibold hover:bg-surface-200 transition-colors flex-shrink-0">
                Detalhes
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Gospel */}
      <div className="bg-gradient-to-br from-surface-50 via-white to-primary-50/30 rounded-2xl border border-surface-200/60 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Cross size={16} className="text-primary-600" />
            <h3 className="font-serif font-semibold text-surface-900 text-sm">Evangelho do Dia</h3>
          </div>
          <blockquote className="text-surface-700 text-[15px] leading-relaxed border-l-2 border-primary-300 pl-5 font-serif italic max-w-2xl">
            "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos darei descanso. Tomai sobre vós o meu jugo e aprendei de mim, porque sou manso e humilde de coração, e encontrareis descanso para as vossas almas."
          </blockquote>
          <p className="text-xs text-primary-600 font-semibold mt-4 tracking-wide">— Mateus 11, 28-29</p>
        </div>
      </div>
    </div>
  );
}
