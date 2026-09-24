import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Calendar, TrendingUp, Cross, Church } from 'lucide-react';

export default function ExplorePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-semibold text-surface-900 tracking-tight">Explorar</h1>
        <p className="text-surface-500 text-sm mt-1.5">Descubra pessoas, comunidades e eventos</p>
      </div>

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
