import React, { useState } from 'react';
import { posts } from '../data/mockData';
import { Heart, Cross, Sparkles } from 'lucide-react';

const prayerCategories = [
  { id: 'all', label: 'Todos' },
  { id: 'saude', label: 'Saúde' },
  { id: 'familia', label: 'Família' },
  { id: 'trabalho', label: 'Trabalho' },
  { id: 'espiritual', label: 'Espiritual' },
  { id: 'gratidao', label: 'Gratidão' },
];

const prayerPosts = posts.filter(p => p.type === 'prayer' || p.prayerRequest);

export default function PrayerPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [prayedRequests, setPrayedRequests] = useState<Set<string>>(new Set(['p4']));

  const handlePray = (id: string) => {
    setPrayedRequests(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-surface-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-surface-900/20">
          <Cross size={24} className="text-white" />
        </div>
        <h1 className="text-3xl font-serif font-semibold text-surface-900 tracking-tight">Pedido de Oração</h1>
        <p className="text-surface-500 text-sm mt-2 max-w-md mx-auto leading-relaxed italic font-serif">
          "Onde dois ou três estiverem reunidos em meu nome, aí estou eu no meio deles."
        </p>
        <p className="text-surface-400 text-xs mt-1">— Mateus 18,20</p>
      </div>

      {/* Create Request */}
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-5">
        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full py-3.5 border border-dashed border-surface-300 rounded-xl text-sm text-surface-500 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50/30 transition-all font-medium"
          >
            Fazer um pedido de oração
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Título do pedido..."
              className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-200 transition-all"
            />
            <textarea
              placeholder="Descreva seu pedido de oração..."
              rows={3}
              className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-200 transition-all resize-none"
            />
            <div className="flex items-center justify-between">
              <select className="px-3 py-2 bg-surface-50 border border-surface-100 rounded-lg text-xs text-surface-600 focus:outline-none">
                {prayerCategories.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-xs text-surface-600 hover:bg-surface-100 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button className="px-4 py-2 bg-surface-900 text-white text-xs rounded-lg hover:bg-surface-800 transition-colors font-semibold">
                  Publicar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {prayerCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-surface-900 text-white'
                : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Prayer Requests */}
      <div className="space-y-4">
        {prayerPosts.map(post => {
          const prayed = prayedRequests.has(post.id);
          return (
            <div key={post.id} className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-5 animate-fade-in-up">
              <div className="flex items-start gap-3.5">
                <img src={post.author.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-1 ring-surface-100" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-surface-900 text-sm">{post.author.name}</h4>
                    <span className="text-[11px] text-surface-400">
                      {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {post.prayerRequest && (
                    <>
                      <h3 className="font-medium text-surface-900 mt-2.5 text-[15px]">{post.prayerRequest.title}</h3>
                      <p className="text-sm text-surface-600 mt-1.5 leading-relaxed">{post.prayerRequest.description}</p>
                    </>
                  )}

                  <div className="flex items-center gap-4 mt-5 pt-4 border-t border-surface-100">
                    <button
                      onClick={() => handlePray(post.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        prayed
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'bg-surface-100 text-surface-600 hover:bg-surface-200 border border-transparent'
                      }`}
                    >
                      <Heart size={14} fill={prayed ? 'currentColor' : 'none'} />
                      {prayed ? 'Estou rezando' : 'Vou rezar por você'}
                    </button>
                    <span className="text-xs text-surface-500 font-medium">
                      {post.prayerRequest?.prayersCount || 0} pessoas rezando
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Prayer Chain */}
        <div className="bg-gradient-to-br from-surface-900 via-surface-800 to-primary-900 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-400 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <Sparkles size={28} className="mx-auto mb-4 text-gold-300" />
            <h3 className="font-serif font-semibold text-white text-xl mb-2">Corrente de Oração</h3>
            <p className="text-white/60 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              Junte-se a milhares de fiéis em uma corrente de oração pela paz no mundo.
            </p>
            <button className="px-6 py-2.5 bg-white text-surface-900 rounded-xl text-xs font-semibold hover:bg-surface-100 transition-colors shadow-lg">
              Participar da corrente
            </button>
            <p className="text-white/40 text-xs mt-4 font-medium">2.345 pessoas já estão rezando</p>
          </div>
        </div>
      </div>
    </div>
  );
}
