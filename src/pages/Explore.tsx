import React from 'react';
import { users, communities, events } from '../data/mockData';
import { Compass, Users, Calendar, TrendingUp, Cross, Church } from 'lucide-react';

export default function ExplorePage() {
  const suggestedUsers = users.filter(u => u.id !== 'u1').slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 lg:pb-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-800">Explorar</h1>
        <p className="text-surface-500 text-sm mt-1">Descubra pessoas, comunidades e eventos</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Users, label: 'Comunidades', count: '12.5k', color: 'from-primary-500 to-primary-700' },
          { icon: Calendar, label: 'Eventos', count: '3.2k', color: 'from-blue-500 to-blue-700' },
          { icon: Church, label: 'Paróquias', count: '890', color: 'from-gold-500 to-gold-700' },
          { icon: TrendingUp, label: 'Em alta', count: '156', color: 'from-green-500 to-green-700' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-surface-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-3`}>
              <item.icon size={18} className="text-white" />
            </div>
            <p className="font-semibold text-surface-800">{item.label}</p>
            <p className="text-xs text-surface-500">{item.count} ativos</p>
          </div>
        ))}
      </div>

      {/* Suggested People */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-surface-800">Pessoas sugeridas</h2>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Ver todas</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestedUsers.map(user => (
            <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors">
              <div className="relative">
                <img src={user.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                {user.verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Cross size={10} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-surface-800 truncate">{user.name}</h4>
                <p className="text-xs text-surface-500 truncate">{user.bio}</p>
                <p className="text-xs text-surface-400 mt-0.5">{user.followers} seguidores</p>
              </div>
              <button className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-xs font-medium hover:bg-primary-200 transition-colors">
                Seguir
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Communities */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-surface-800">Comunidades em destaque</h2>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Ver todas</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {communities.slice(0, 4).map(community => (
            <div key={community.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors cursor-pointer">
              <img src={community.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-surface-800 truncate">{community.name}</h4>
                <p className="text-xs text-surface-500">{community.members.toLocaleString()} membros</p>
              </div>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                community.joined
                  ? 'bg-surface-100 text-surface-600'
                  : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              }`}>
                {community.joined ? 'Membro' : 'Participar'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-surface-800">Próximos eventos</h2>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Ver todos</button>
        </div>
        <div className="space-y-3">
          {events.slice(0, 3).map(event => (
            <div key={event.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-primary-700">{new Date(event.date).getDate()}</span>
                <span className="text-[10px] text-primary-500">{new Date(event.date).toLocaleDateString('pt-BR', { month: 'short' })}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-surface-800 truncate">{event.title}</h4>
                <p className="text-xs text-surface-500">{event.time} • {event.location}</p>
              </div>
              <button className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-xs font-medium hover:bg-primary-200 transition-colors">
                Detalhes
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Gospel */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-gold-50 rounded-2xl border border-primary-100 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Cross size={18} className="text-primary-600" />
          <h3 className="font-semibold text-surface-800">Evangelho do Dia</h3>
        </div>
        <blockquote className="text-surface-700 italic text-sm leading-relaxed border-l-2 border-primary-300 pl-4">
          "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos darei descanso. Tomai sobre vós o meu jugo e aprendei de mim, porque sou manso e humilde de coração, e encontrareis descanso para as vossas almas."
        </blockquote>
        <p className="text-xs text-primary-600 font-medium mt-3">— Mateus 11, 28-29</p>
      </div>
    </div>
  );
}
