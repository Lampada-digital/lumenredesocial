import React, { useState } from 'react';
import { posts } from '../data/mockData';
import { Heart, Send, Search, Filter, Clock, Globe, Lock, Users, Cross, Sparkles } from 'lucide-react';

const prayerCategories = [
  { id: 'all', label: 'Todos', emoji: '🙏' },
  { id: 'saude', label: 'Saúde', emoji: '💚' },
  { id: 'familia', label: 'Família', emoji: '👨‍👩‍👧' },
  { id: 'trabalho', label: 'Trabalho', emoji: '💼' },
  { id: 'espiritual', label: 'Espiritual', emoji: '✨' },
  { id: 'gratidao', label: 'Gratidão', emoji: '🙌' },
  { id: 'falecimento', label: 'Falecimento', emoji: '🕊️' },
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
    <div className="max-w-3xl mx-auto space-y-6 pb-20 lg:pb-4">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Cross size={28} className="text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-surface-800">Pedido de Oração</h1>
        <p className="text-surface-500 text-sm mt-1">"Onde dois ou três estiverem reunidos em meu nome, aí estou eu no meio deles." — Mt 18,20</p>
      </div>

      {/* Create Request */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-4">
        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full py-3 border-2 border-dashed border-surface-200 rounded-xl text-sm text-surface-500 hover:border-primary-300 hover:text-primary-600 transition-colors"
          >
            ✍️ Fazer um pedido de oração
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Título do pedido..."
              className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
            <textarea
              placeholder="Descreva seu pedido de oração..."
              rows={3}
              className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none"
            />
            <div className="flex items-center justify-between">
              <select className="px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm text-surface-600">
                {prayerCategories.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-sm text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
                  Publicar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {prayerCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-200'
                : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Prayer Requests */}
      <div className="space-y-4">
        {prayerPosts.map(post => {
          const prayed = prayedRequests.has(post.id);
          return (
            <div key={post.id} className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5 animate-fade-in">
              <div className="flex items-start gap-3">
                <img src={post.author.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-surface-800 text-sm">{post.author.name}</h4>
                    <span className="text-xs text-surface-400">
                      {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {post.prayerRequest && (
                    <>
                      <h3 className="font-medium text-surface-800 mt-2">{post.prayerRequest.title}</h3>
                      <p className="text-sm text-surface-600 mt-1">{post.prayerRequest.description}</p>
                    </>
                  )}

                  <p className="text-sm text-surface-600 mt-2 whitespace-pre-line">{post.content}</p>

                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-surface-100">
                    <button
                      onClick={() => handlePray(post.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        prayed
                          ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-200'
                          : 'bg-surface-100 text-surface-600 hover:bg-primary-50 hover:text-primary-600'
                      }`}
                    >
                      <Heart size={16} fill={prayed ? 'currentColor' : 'none'} />
                      {prayed ? 'Estou rezando' : 'Vou rezar por você'}
                    </button>
                    <span className="text-sm text-surface-500">
                      {post.prayerRequest?.prayersCount || 0} pessoas rezando
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Additional prayer cards */}
        <div className="bg-gradient-to-br from-primary-50 to-gold-50 rounded-2xl border border-primary-100 p-6 text-center">
          <Sparkles size={32} className="mx-auto mb-3 text-primary-500" />
          <h3 className="font-semibold text-surface-800 mb-2">Corrente de Oração</h3>
          <p className="text-sm text-surface-600 mb-4">
            Junte-se a milhares de fiéis em uma corrente de oração pela paz no mundo.
          </p>
          <button className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
            Participar da corrente
          </button>
          <p className="text-xs text-surface-500 mt-3">2.345 pessoas já estão rezando</p>
        </div>
      </div>
    </div>
  );
}
