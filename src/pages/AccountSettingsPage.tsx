import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AccountSettingsPage: React.FC = () => {
  const { user, updateAccount } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone ?? '');
    }
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword && !currentPassword) {
      setError('Introdu parola curentă pentru a seta una nouă.');
      return;
    }

    setSaving(true);
    const result = await updateAccount({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      ...(newPassword ? { current_password: currentPassword, new_password: newPassword } : {}),
    });
    setSaving(false);

    if (result.ok) {
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError(result.error ?? 'Eroare necunoscută.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-white pt-24 pb-16">
      <div className="max-w-xl mx-auto px-6">

        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          înapoi acasă
        </Link>

        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#89CFF0]/10 border border-[#89CFF0]/20 flex items-center justify-center text-[#89CFF0]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Setări cont</h1>
            <p className="text-xs text-neutral-500 mt-0.5">Actualizează informațiile tale personale</p>
          </div>
        </div>

        {/* Success banner */}
        {success && (
          <div className="mb-6 px-4 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-300 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Contul a fost actualizat cu succes.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Informații personale ── */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-white">Informații personale</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Nume, email și număr de contact</p>
            </div>
            <div className="p-5 space-y-4">

              {/* Nume */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3 h-3" /> Nume complet
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Numele tău complet"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> Adresă email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@exemplu.ro"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
                />
              </div>

              {/* Telefon */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3 h-3" /> Număr de telefon
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07xx xxx xxx"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* ── Schimbare parolă ── */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-white">Schimbare parolă</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Lasă câmpurile goale dacă nu vrei să schimbi parola</p>
            </div>
            <div className="p-5 space-y-4">

              {/* Parola curentă */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Parola curentă
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Parola nouă */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Parola nouă
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 caractere"
                    className="w-full px-4 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="text-xs text-neutral-500 hover:text-white transition-colors"
            >
              Renunță la modificări
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary-glow px-6 py-2.5 rounded-full text-sm font-bold text-[#07080c] bg-[#89CFF0] hover:bg-[#70c4e8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Se salvează...' : 'Salvează modificările'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
