import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, MapPin, Clock, Users,
  User, Phone, MessageSquare, Calendar, ArrowRight, LogIn,
} from 'lucide-react';
import { TRAVEL_OFFERS, COMPANY_INFO } from '../data/offersData';
import { API_BASE, useAuth } from '../context/AuthContext';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const offerId = searchParams.get('oferta') || '';
  const { user } = useAuth();

  const offer = TRAVEL_OFFERS.find((o) => o.id === offerId) ?? null;

  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.phone) setPhone(user.phone);
  }, [user]);

  // Redirect to offers if no valid offer
  if (!offer && offerId) return <Navigate to="/oferte" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = user
      ? { name: user.name, email: user.email, phone: phone || user.phone || '', offer_id: offerId, offer_title: offer?.title ?? '', message }
      : { name: guestName, email: guestEmail, phone: guestPhone, offer_id: offerId, offer_title: offer?.title ?? '', message };

    try {
      const res = await fetch(`${API_BASE}/reservation.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (data.ok === false) throw new Error(data.error ?? 'Eroare.');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message ?? 'Serverul nu este accesibil. Încearcă mai târziu.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Rezervare trimisă!</h1>
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              Mulțumim{user ? `, ${user.name}` : ''}! Am primit solicitarea ta pentru <span className="text-white font-medium">{offer?.title}</span> și te vom contacta în curând.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {user && (
              <Link
                to="/cont/profil"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold text-[#07080c] bg-[#89CFF0] hover:bg-[#70c4e8] transition-colors"
              >
                Rezervările mele <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link
              to="/oferte"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium text-neutral-300 border border-white/10 hover:border-white/20 hover:text-white transition-colors"
            >
              Vezi mai multe oferte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Back */}
        <Link
          to="/oferte"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> înapoi la oferte
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* ── Left: offer summary card ── */}
          <div className="lg:col-span-2 space-y-4">
            {offer && (
              <>
                <div className="rounded-2xl overflow-hidden border border-white/[0.07]">
                  <div className="aspect-[16/10] overflow-hidden bg-neutral-900">
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 bg-white/[0.03] space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-[#89CFF0] uppercase tracking-wider mb-1">
                        {offer.category}
                      </p>
                      <h2 className="text-base font-bold text-white leading-snug">{offer.title}</h2>
                      <p className="text-xs text-neutral-400 mt-1">{offer.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2 text-neutral-400">
                        <MapPin className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                        {offer.destination}
                      </div>
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Clock className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                        {offer.durationDays}z / {offer.durationNights}n
                      </div>
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Users className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                        {offer.spotsRemaining} locuri libere
                      </div>
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Calendar className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                        {offer.nextDepartures[0]}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06]">
                      <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-0.5">Preț / persoană</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-white">
                          {offer.priceRon.toLocaleString('ro-RO')}
                        </span>
                        <span className="text-sm text-neutral-400">RON</span>
                        {offer.originalPriceRon && (
                          <span className="text-xs text-neutral-600 line-through">
                            {offer.originalPriceRon.toLocaleString('ro-RO')} RON
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Included highlights */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-2">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Inclus în pachet</p>
                  {offer.includedServices.slice(0, 4).map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#89CFF0] shrink-0 mt-0.5" />
                      {s}
                    </div>
                  ))}
                </div>
              </>
            )}

            {!offer && (
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-8 text-center">
                <p className="text-xs text-neutral-500">Nicio ofertă selectată.</p>
                <Link to="/oferte" className="text-xs text-[#89CFF0] hover:underline mt-2 inline-block">
                  Alege o ofertă
                </Link>
              </div>
            )}
          </div>

          {/* ── Right: booking form ── */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Rezervă locul tău</h1>
              <p className="text-sm text-neutral-500 mt-1">Completează datele de mai jos și te contactăm în 24h.</p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">

              {/* Auth header */}
              {user ? (
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#89CFF0]/10 border border-[#89CFF0]/20 flex items-center justify-center text-[#89CFF0] shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                    <div className="text-[10px] text-neutral-500 truncate">{user.email}</div>
                  </div>
                  <Link to="/cont/setari" className="text-[10px] text-neutral-500 hover:text-white transition-colors shrink-0">
                    Editează →
                  </Link>
                </div>
              ) : (
                <div className="px-6 py-3.5 border-b border-white/[0.06] flex items-center justify-between gap-3 bg-[#89CFF0]/[0.04]">
                  <p className="text-xs text-neutral-400">
                    Ai cont? Loghează-te pentru a rezerva mai rapid.
                  </p>
                  <Link
                    to={`/login?redirect=/rezervare?oferta=${offerId}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#07080c] bg-[#89CFF0] hover:bg-[#70c4e8] transition-colors shrink-0"
                  >
                    <LogIn className="w-3 h-3" /> Intră în cont
                  </Link>
                </div>
              )}

              <div className="p-6 space-y-4">
                {/* Guest-only fields */}
                {!user && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3 h-3" /> Nume complet <span className="text-[#89CFF0]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ion Popescu"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                        Email <span className="text-[#89CFF0]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ion@exemplu.ro"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> Număr de telefon {!user && <span className="text-[#89CFF0]">*</span>}
                  </label>
                  {user ? (
                    <input
                      type="tel"
                      placeholder={user.phone || '07xxxxxxxx'}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
                    />
                  ) : (
                    <input
                      type="tel"
                      required
                      placeholder="07xxxxxxxx"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
                    />
                  )}
                  {user?.phone && !phone && (
                    <p className="text-[10px] text-neutral-600">
                      Se va folosi {user.phone} din contul tău.
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3" /> Mesaj / Detalii suplimentare <span className="text-[#89CFF0]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ex: suntem 15 elevi + 2 profesori, ne interesează luna noiembrie, avem întrebări despre cazare..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/50 transition-colors resize-none"
                  />
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-glow w-full py-3 rounded-full text-sm font-bold text-[#07080c] bg-[#89CFF0] hover:bg-[#70c4e8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#07080c]/30 border-t-[#07080c] rounded-full animate-spin" />
                      Se trimite...
                    </>
                  ) : (
                    <>
                      Confirmă rezervarea
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-neutral-600 text-center">
                  Rezervarea nu implică niciun cost imediat. Un agent te va contacta pentru confirmare și detalii de plată.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
