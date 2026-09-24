import React, { useState } from 'react';
import { conversations } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import {
  Search, Plus, Phone, Video, MoreVertical, Send,
  Image, Smile, Paperclip, Mic, Check, CheckCheck,
  ArrowLeft, Users
} from 'lucide-react';
import type { Conversation, Message } from '../types';

function MessageStatus({ status }: { status: string }) {
  if (status === 'sent') return <Check size={12} className="text-surface-400" />;
  if (status === 'delivered') return <CheckCheck size={12} className="text-surface-400" />;
  if (status === 'read') return <CheckCheck size={12} className="text-primary-500" />;
  return null;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConvs = conversations.filter(c => {
    if (!searchQuery) return true;
    const name = c.isGroup ? c.groupName : c.participants[0]?.name;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const mockMessages: Message[] = [
    { id: 'm1', senderId: 'u2', content: 'Paz de Cristo, Maria! Como vai?', type: 'text', createdAt: '2025-01-15T08:00:00Z', status: 'read', reactions: [] },
    { id: 'm2', senderId: 'u1', content: 'Graças a Deus, padre! Tudo bem. E o senhor?', type: 'text', createdAt: '2025-01-15T08:05:00Z', status: 'read', reactions: [] },
    { id: 'm3', senderId: 'u2', content: 'Tudo bem também! Queria confirmar sobre a missa de amanhã.', type: 'text', createdAt: '2025-01-15T08:10:00Z', status: 'read', reactions: [] },
    { id: 'm4', senderId: 'u1', content: 'Sim, estarei lá! Posso levar algo para a PASCOM?', type: 'text', createdAt: '2025-01-15T08:15:00Z', status: 'read', reactions: [] },
    { id: 'm5', senderId: 'u2', content: 'Não se preocupe, a missa de amanhã está confirmada. Até lá! 🙏', type: 'text', createdAt: '2025-01-15T09:00:00Z', status: 'read', reactions: [] },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 lg:pb-4">
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden h-[calc(100vh-8rem)]">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className={`w-full lg:w-80 border-r border-surface-200 flex flex-col ${selectedConv ? 'hidden lg:flex' : 'flex'}`}>
            {/* Header */}
            <div className="p-4 border-b border-surface-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-surface-800">Mensagens</h2>
                <button className="p-2 hover:bg-surface-100 rounded-lg transition-colors">
                  <Plus size={18} className="text-surface-600" />
                </button>
              </div>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar conversas..."
                  className="w-full pl-9 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.map(conv => {
                const otherUser = conv.participants[0];
                const isSelected = selectedConv?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-surface-50 transition-colors border-b border-surface-50 ${
                      isSelected ? 'bg-primary-50 border-l-2 border-l-primary-500' : ''
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={conv.isGroup ? conv.groupImage : otherUser.avatar}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {!conv.isGroup && otherUser.presence === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-surface-800 truncate">
                          {conv.isGroup ? conv.groupName : otherUser.name}
                        </h4>
                        <span className="text-xs text-surface-400">
                          {new Date(conv.lastMessage.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-surface-500 truncate pr-2">
                          {conv.lastMessage.senderId === user?.id && 'Você: '}{conv.lastMessage.content}
                        </p>
                        {conv.unread > 0 && (
                          <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${!selectedConv ? 'hidden lg:flex' : 'flex'}`}>
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-surface-100">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedConv(null)} className="lg:hidden p-1 hover:bg-surface-100 rounded-lg">
                      <ArrowLeft size={20} />
                    </button>
                    <img
                      src={selectedConv.isGroup ? selectedConv.groupImage : selectedConv.participants[0].avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-surface-800 text-sm">
                        {selectedConv.isGroup ? selectedConv.groupName : selectedConv.participants[0].name}
                      </h3>
                      <p className="text-xs text-green-600">
                        {selectedConv.isGroup ? `${selectedConv.participants.length} membros` : 'Online'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-surface-100 rounded-lg transition-colors">
                      <Phone size={18} className="text-surface-600" />
                    </button>
                    <button className="p-2 hover:bg-surface-100 rounded-lg transition-colors">
                      <Video size={18} className="text-surface-600" />
                    </button>
                    <button className="p-2 hover:bg-surface-100 rounded-lg transition-colors">
                      <MoreVertical size={18} className="text-surface-600" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-50/50">
                  {mockMessages.map(msg => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                          isMe
                            ? 'bg-primary-600 text-white rounded-br-md'
                            : 'bg-white text-surface-700 border border-surface-200 rounded-bl-md'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                            <span className={`text-[10px] ${isMe ? 'text-primary-200' : 'text-surface-400'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && <MessageStatus status={msg.status} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-surface-100 bg-white">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-surface-100 rounded-lg transition-colors">
                      <Paperclip size={18} className="text-surface-500" />
                    </button>
                    <button className="p-2 hover:bg-surface-100 rounded-lg transition-colors">
                      <Image size={18} className="text-surface-500" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageText}
                        onChange={e => setMessageText(e.target.value)}
                        placeholder="Digite uma mensagem..."
                        className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Smile size={18} className="text-surface-400" />
                      </button>
                    </div>
                    {messageText.trim() ? (
                      <button className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                        <Send size={18} />
                      </button>
                    ) : (
                      <button className="p-2.5 hover:bg-surface-100 rounded-xl transition-colors">
                        <Mic size={18} className="text-surface-500" />
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={32} className="text-primary-500" />
                  </div>
                  <h3 className="font-semibold text-surface-700 mb-1">Suas mensagens</h3>
                  <p className="text-sm text-surface-500">Selecione uma conversa para começar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
