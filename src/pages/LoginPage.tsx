import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) navigate('/');
    else setError(result.error ?? 'A apărut o eroare.');
  };

  return (
    <div className="min-h-screen bg-[#07080c] flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#89CFF0]/[0.05] blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-[380px]">
        <div className="flex items-center justify-center gap-2 mb-10">
          <Compass className="w-5 h-5 text-[#89CFF0]" />
          <span className="font-extrabold tracking-tight text-white text-xl">
            aventure<span className="text-[#89CFF0]">.</span>
          </span>
        </div>

        <div
          className="rounded-3xl p-8 space-y-5"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(48px) saturate(160%)',
            WebkitBackdropFilter: 'blur(48px) saturate(160%)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 20px 60px -12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)',
          }}
        >
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-white tracking-tight">Bine ai revenit</h1>
            <p className="text-xs text-neutral-500">Autentifică-te în contul tău.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#89CFF0]/40 transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Parolă"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-2xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#89CFF0]/40 transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 px-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary-glow w-full py-3 rounded-2xl text-sm font-semibold text-[#07080c] bg-[#89CFF0] hover:bg-[#70c4e8] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Se procesează...
                </span>
              ) : 'Intră în cont'}
            </button>
          </form>

          <p className="text-center text-xs text-neutral-500">
            Nu ai cont?{' '}
            <Link to="/register" className="text-[#89CFF0] hover:underline underline-offset-2 font-medium">
              Înregistrează-te
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
