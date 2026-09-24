import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchPosts, createPost } from '../lib/database';
import { isSupabaseConfigured } from '../lib/supabase';
import { Heart, Cross, Sparkles } from 'lucide-react';

export default function PrayerPage() {
  const { user } = useAuth();
  const [prayers, setPrayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadPrayers();
  }, []);

  const loadPrayers = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const data = await fetchPosts(50, 0);
    setPrayers(data.filter(p => p.type === 'prayer'));
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!user || !title.trim() || !description.trim()) return;

    const post = await createPost({
      author_id: user.id,
      content: description,
      type: 'prayer',
      privacy: 'public',
      prayer_title: title,
      prayer_description: description,
      prayer_category: 'geral',
    });

    if (post) {
      setPrayers([post, ...prayers]);
      setTitle('');
      setDescription('');
      setShowCreateForm(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-surface-200/60 p-8 text-center">
          <div className="w-8 h-8 border-2 border-surface-300 border-t-primary-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-surface-500 mt-3">Carregando pedidos de oração...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Título do pedido..."
              className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-200 transition-all"
            />
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descreva seu pedido de oração..."
              rows={3}
              className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-200 transition-all resize-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-xs text-surface-600 hover:bg-surface-100 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!title.trim() || !description.trim()}
                className="px-4 py-2 bg-surface-900 text-white text-xs rounded-lg hover:bg-surface-800 transition-colors font-semibold disabled:opacity-50"
              >
                Publicar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {prayers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-200/60 p-12 text-center">
            <Heart size={40} className="mx-auto mb-3 text-surface-300" />
            <p className="text-surface-500 text-sm">Nenhum pedido de oração ainda</p>
            <p className="text-surface-400 text-xs mt-1">Seja o primeiro a partilhar um pedido</p>
          </div>
        ) : (
          prayers.map(prayer => (
            <div key={prayer.id} className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-5 animate-fade-in-up">
              <div className="flex items-start gap-3.5">
                <img src={prayer.author?.avatar_url || ''} alt="" className="w-10 h-10 rounded-full object-cover ring-1 ring-surface-100 bg-surface-100" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-surface-900 text-sm">{prayer.author?.full_name}</h4>
                    <span className="text-[11px] text-surface-400">
                      {new Date(prayer.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {prayer.prayer_title && (
                    <>
                      <h3 className="font-medium text-surface-900 mt-2.5 text-[15px]">{prayer.prayer_title}</h3>
                      <p className="text-sm text-surface-600 mt-1.5 leading-relaxed">{prayer.content}</p>
                    </>
                  )}

                  <div className="flex items-center gap-4 mt-5 pt-4 border-t border-surface-100">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-surface-100 text-surface-600 hover:bg-surface-200 transition-all">
                      <Heart size={14} />
                      Vou rezar por você
                    </button>
                    <span className="text-xs text-surface-500 font-medium">
                      {prayer.prayers_count || 0} pessoas rezando
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
