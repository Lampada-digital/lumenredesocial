import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, MapPin, AtSign, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('');
  const [parish, setParish] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error || 'Credenciais inválidas.');
        }
      } else {
        if (!name || !email || !password || !username) {
          setError('Preencha todos os campos obrigatórios.');
          setLoading(false);
          return;
        }
        const result = await register({ full_name: name, email, username, password, city, parish });
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error || 'Erro ao criar conta.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-50">
      {/* Left: Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-surface-900">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-surface-900 to-primary-900" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          {/* Decorative circles */}
          <div className="absolute top-20 -left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between px-16 py-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gold-300">
                <path d="M12 2L12 22M7 7L17 7M5 12L19 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-serif font-semibold text-white tracking-tight">Lumen</h1>
              <p className="text-[11px] text-white/40 tracking-widest uppercase">Rede Social Católica</p>
            </div>
          </div>

          {/* Main content */}
          <div className="max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-serif font-medium text-white leading-[1.15] tracking-tight">
              Conecte-se com sua
              <span className="block text-gold-300 mt-1">comunidade de fé</span>
            </h2>
            <p className="text-white/60 text-base mt-6 leading-relaxed max-w-md">
              Uma rede social pensada para católicos. Partilhe sua fé, encontre sua paróquia, participe de eventos e cresça espiritualmente.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { label: 'Comunidades', value: '12.5k+' },
                { label: 'Paróquias', value: '890' },
                { label: 'Eventos/mês', value: '3.2k' },
                { label: 'Fiéis ativos', value: '45k+' },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs text-white/50 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer quote */}
          <div className="border-l border-white/10 pl-5">
            <p className="text-white/70 text-sm italic font-serif leading-relaxed">
              "Vós sois a luz do mundo."
            </p>
            <p className="text-white/40 text-xs mt-2 tracking-wide">— Mateus 5,14</p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L12 22M7 7L17 7M5 12L19 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xl font-serif font-semibold text-surface-900">Lumen</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-surface-900 tracking-tight">
              {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h2>
            <p className="text-surface-500 text-sm mt-2">
              {isLogin ? 'Entre na sua comunidade de fé' : 'Junte-se à maior rede social católica'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-medium text-surface-700 mb-1.5 uppercase tracking-wide">Nome completo</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-700 mb-1.5 uppercase tracking-wide">Usuário</label>
                  <div className="relative">
                    <AtSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="seunome"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-surface-700 mb-1.5 uppercase tracking-wide">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-700 mb-1.5 uppercase tracking-wide">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-surface-700 mb-1.5 uppercase tracking-wide">Cidade</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Cidade"
                      className="w-full pl-10 pr-3 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-700 mb-1.5 uppercase tracking-wide">Paróquia</label>
                  <input
                    type="text"
                    value={parish}
                    onChange={e => setParish(e.target.value)}
                    placeholder="Paróquia"
                    className="w-full px-3 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500/30" />
                  <span className="text-sm text-surface-600">Lembrar-me</span>
                </label>
                <button type="button" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Esqueci a senha
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-surface-900 text-white rounded-xl font-medium hover:bg-surface-800 transition-all shadow-lg shadow-surface-900/10 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                isLogin ? 'Entrar' : 'Criar conta'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-surface-500 text-sm">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="ml-1.5 text-primary-600 hover:text-primary-700 font-semibold"
              >
                {isLogin ? 'Cadastre-se' : 'Faça login'}
              </button>
            </p>
          </div>

          {!isLogin && (
            <p className="mt-6 text-xs text-surface-400 text-center leading-relaxed">
              Ao criar uma conta, você concorda com nossos Termos de Uso e Política de Privacidade.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
