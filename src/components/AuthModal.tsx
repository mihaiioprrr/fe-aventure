import React, { useState } from 'react';
import { X, Mail, Lock, User, Calendar, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalTab, closeAuthModal, login, register, openAuthModal } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setEmail(''); setPassword(''); setName(''); setBirthdate('');
    setError(''); setShowPassword(false);
  };

  const switchTab = (tab: 'login' | 'register') => {
    resetForm();
    openAuthModal(tab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (authModalTab === 'login') {
      result = await login(email, password);
    } else {
      if (!name.trim()) { setError('Numele este obligatoriu.'); setLoading(false); return; }
      if (!birthdate) { setError('Data nașterii este obligatorie.'); setLoading(false); return; }
      result = await register(email, password, name, birthdate);
    }

    setLoading(false);
    if (result.ok) {
      resetForm();
      closeAuthModal();
    } else {
      setError(result.error ?? 'A apărut o eroare.');
    }
  };

  if (!authModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md"
        onClick={closeAuthModal}
      />

      <div className="relative w-full max-w-sm rounded-2xl bg-[#0c101a] border border-white/10 shadow-2xl z-10 overflow-hidden">
        <div className="flex border-b border-white/[0.06]">
          <button
            type="button"
            onClick={() => switchTab('login')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              authModalTab === 'login'
                ? 'text-white bg-white/[0.04]'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Autentificare
          </button>
          <button
            type="button"
            onClick={() => switchTab('register')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              authModalTab === 'register'
                ? 'text-white bg-white/[0.04]'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Cont nou
          </button>
          <button
            type="button"
            onClick={closeAuthModal}
            className="btn-press px-4 text-neutral-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center space-y-1 pb-1">
            <h2 className="text-lg font-bold text-white">
              {authModalTab === 'login' ? 'Bine ai revenit' : 'Creează un cont'}
            </h2>
            <p className="text-xs text-neutral-500">
              {authModalTab === 'login'
                ? 'Loghează-te pentru a putea rezerva.'
                : 'Înregistrează-te gratuit și rezervă oricând.'}
            </p>
          </div>

          {authModalTab === 'register' && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Nume și prenume"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="email"
              placeholder="Adresă de email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Parolă"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {authModalTab === 'register' && (
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="date"
                required
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-[#89CFF0]/50 transition-colors [color-scheme:dark]"
              />
            </div>
          )}

          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-glow w-full py-2.5 rounded-full text-sm font-semibold text-[#07080c] bg-[#89CFF0] hover:bg-[#70c4e8] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Se procesează...'
              : authModalTab === 'login' ? 'Intră în cont' : 'Creează contul'}
          </button>

          <p className="text-center text-xs text-neutral-500">
            {authModalTab === 'login' ? 'Nu ai cont?' : 'Ai deja cont?'}{' '}
            <button
              type="button"
              onClick={() => switchTab(authModalTab === 'login' ? 'register' : 'login')}
              className="text-[#89CFF0] hover:underline font-medium"
            >
              {authModalTab === 'login' ? 'Înregistrează-te' : 'Autentifică-te'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
