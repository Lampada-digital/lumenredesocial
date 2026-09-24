import React from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { MessageCircle, Send } from 'lucide-react';

export default function MessagesPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-surface-200/60 p-12 text-center">
          <MessageCircle size={40} className="mx-auto mb-3 text-surface-300" />
          <h2 className="font-serif font-semibold text-surface-900 mb-2">Mensagens</h2>
          <p className="text-sm text-surface-500">Configure o Supabase para usar mensagens em tempo real</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm overflow-hidden h-[calc(100vh-7rem)]">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Send size={24} className="text-surface-400" />
            </div>
            <h3 className="font-semibold text-surface-700 text-sm mb-1">Suas mensagens</h3>
            <p className="text-xs text-surface-400">Selecione uma conversa para começar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
