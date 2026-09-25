import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as localDb from '../lib/localDatabase';
import { Search, Plus, Send, ArrowLeft, Smile, X } from 'lucide-react';
import EmojiPicker from '../components/EmojiPicker';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (user) {
      loadConversations();
      loadUsers();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const loadConversations = () => {
    if (!user) return;
    const convs = localDb.getUserConversations(user.id);
    setConversations(convs);
  };

  const loadUsers = () => {
    const allUsers = localDb.searchUsers('');
    setUsers(allUsers.filter(u => u.id !== user?.id));
  };

  const loadMessages = (conversationId: string) => {
    const msgs = localDb.getConversationMessages(conversationId);
    setMessages(msgs);
  };

  const handleSendMessage = () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    const message = localDb.sendMessage(selectedConversation, user.id, newMessage, 'text');
    const messageWithSender = {
      ...message,
      sender: localDb.getUserById(user.id),
    };

    setMessages([...messages, messageWithSender]);
    setNewMessage('');
    loadConversations(); // Atualiza lista de conversas
  };

  const handleSendEmoji = (emoji: string) => {
    if (!user || !selectedConversation) return;

    const message = localDb.sendMessage(selectedConversation, user.id, emoji, 'emoji');
    const messageWithSender = {
      ...message,
      sender: localDb.getUserById(user.id),
    };

    setMessages([...messages, messageWithSender]);
    setShowEmojiPicker(false);
    loadConversations();
  };

  const handleCreateConversation = (otherUserId: string) => {
    if (!user) return;

    const conversation = localDb.findOrCreateDirectConversation(user.id, otherUserId);
    setSelectedConversation(conversation.id);
    setShowNewConversation(false);
    loadConversations();
    loadMessages(conversation.id);
  };

  const getConversationName = (conv: any) => {
    if (conv.is_group) return conv.group_name;
    
    const otherUserId = conv.participants.find((id: string) => id !== user?.id);
    const otherUser = localDb.getUserById(otherUserId);
    return otherUser?.full_name || 'Conversa';
  };

  const getConversationAvatar = (conv: any) => {
    if (conv.is_group) return '';
    
    const otherUserId = conv.participants.find((id: string) => id !== user?.id);
    const otherUser = localDb.getUserById(otherUserId);
    return otherUser?.avatar_url || '';
  };

  const filteredConversations = conversations.filter(conv => {
    const name = getConversationName(conv).toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-surface-200/60 p-12 text-center">
          <p className="text-surface-500">Faça login para ver suas mensagens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm overflow-hidden h-[calc(100vh-7rem)]">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className={`w-full md:w-96 border-r border-surface-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
            {/* Header */}
            <div className="p-4 border-b border-surface-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-serif font-semibold text-surface-900">Mensagens</h2>
                <button
                  onClick={() => setShowNewConversation(true)}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                >
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
                  className="w-full pl-9 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-surface-500 text-sm">Nenhuma conversa ainda</p>
                  <button
                    onClick={() => setShowNewConversation(true)}
                    className="mt-3 px-4 py-2 bg-surface-900 text-white text-xs font-semibold rounded-lg hover:bg-surface-800 transition-colors"
                  >
                    Iniciar conversa
                  </button>
                </div>
              ) : (
                filteredConversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-surface-50 transition-colors border-b border-surface-50 ${
                      selectedConversation === conv.id ? 'bg-surface-50' : ''
                    }`}
                  >
                    <img
                      src={getConversationAvatar(conv)}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover bg-surface-100"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-sm font-semibold text-surface-900 truncate">
                        {getConversationName(conv)}
                      </h4>
                      {conv.last_message && (
                        <p className="text-xs text-surface-500 truncate mt-0.5">
                          {conv.last_message}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-4 border-b border-surface-100">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="flex-1">
                    <h3 className="font-semibold text-surface-900">
                      {getConversationName(conversations.find(c => c.id === selectedConversation))}
                    </h3>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map(msg => {
                    const isMe = msg.sender_id === user.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? 'flex-row-reverse' : ''}`}>
                          {!isMe && (
                            <img
                              src={msg.sender?.avatar_url || ''}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover bg-surface-100"
                            />
                          )}
                          <div
                            className={`px-4 py-2.5 rounded-2xl ${
                              isMe
                                ? 'gradient-primary text-white'
                                : 'bg-surface-100 text-surface-900'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-surface-500'}`}>
                              {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-surface-100">
                  <div className="flex items-center gap-2 relative">
                    <div className="relative">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                      >
                        <Smile size={20} className="text-surface-500" />
                      </button>
                      {showEmojiPicker && (
                        <EmojiPicker
                          onSelect={handleSendEmoji}
                          onClose={() => setShowEmojiPicker(false)}
                        />
                      )}
                    </div>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Digite uma mensagem..."
                      className="flex-1 px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-surface-300 transition-all"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2.5 gradient-primary text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Send size={24} className="text-surface-400" />
                  </div>
                  <h3 className="font-semibold text-surface-700 text-sm mb-1">Suas mensagens</h3>
                  <p className="text-xs text-surface-400">Selecione uma conversa para começar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Conversation Modal */}
      {showNewConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-semibold text-surface-900">Nova Conversa</h2>
              <button
                onClick={() => setShowNewConversation(false)}
                className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleCreateConversation(u.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-surface-50 rounded-xl transition-colors"
                >
                  <img
                    src={u.avatar_url || ''}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover bg-surface-100"
                  />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-surface-900">{u.full_name}</p>
                    <p className="text-xs text-surface-500">@{u.username}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
