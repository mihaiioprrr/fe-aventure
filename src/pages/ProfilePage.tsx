import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
  User, Mail, Phone, Calendar, Settings, ArrowRight,
  MapPin, Clock, CheckCircle2, AlertCircle, Loader2, Package, RefreshCw,
} from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import { TRAVEL_OFFERS } from '../data/offersData';

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  offer_id: string;
  offer_title: string;
  message: string;
  status: 'noua' | 'in_progres' | 'confirmata' | 'anulata';
  created_at: string;
}

const STATUS_CONFIG = {
  noua: {
    label: 'În așteptare',
    color: 'bg-[#89CFF0]/15 text-[#89CFF0]',
    dot: 'bg-[#89CFF0]',
    icon: Clock,
  },
  in_progres: {
    label: 'În procesare',
    color: 'bg-yellow-400/15 text-yellow-300',
    dot: 'bg-yellow-400',
    icon: Loader2,
  },
  confirmata: {
    label: 'Confirmată',
    color: 'bg-emerald-400/15 text-emerald-300',
    dot: 'bg-emerald-400',
    icon: CheckCircle2,
  },
  anulata: {
    label: 'Anulată',
    color: 'bg-red-400/15 text-red-400',
    dot: 'bg-red-400',
    icon: AlertCircle,
  },
};

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError('');
    fetch(`${API_BASE}/my-reservations.php`, {
      headers: {
        'X-User-Id': String(user.id),
        'X-User-Email': user.email,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setReservations(data.reservations);
        else setError(data.error ?? 'Eroare la încărcare.');
      })
      .catch(() => setError('Serverul nu este accesibil.'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  // Find offer details from static data (fallback to DB title)
  const getOffer = (offerId: string) =>
    TRAVEL_OFFERS.find((o) => o.id === offerId);

  const activeCount = reservations.filter((r) => r.status !== 'anulata').length;
  const confirmedCount = reservations.filter((r) => r.status === 'confirmata').length;

  return (
    <div className="min-h-screen bg-[#07080c] text-white pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6 space-y-8">

        {/* ── Hero card ── */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
          {/* Cover strip */}
          <div className="h-24 bg-gradient-to-r from-[#89CFF0]/20 via-[#4a9fd4]/15 to-transparent" />

          <div className="px-6 pb-6 -mt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Avatar + info */}
            <div className="flex items-end gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#89CFF0]/10 border-2 border-[#07080c] ring-2 ring-[#89CFF0]/30 flex items-center justify-center text-[#89CFF0] shrink-0">
                <User className="w-7 h-7" />
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-extrabold text-white tracking-tight">{user.name}</h1>
                <p className="text-xs text-neutral-500 mt-0.5">{user.email}</p>
                {user.role === 'admin' && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#89CFF0]/15 text-[#89CFF0] uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-2 pb-1">
              <Link
                to="/cont/setari"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white border border-white/[0.08] hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.07] transition-all"
              >
                <Settings className="w-3.5 h-3.5" />
                Setări cont
              </Link>
              <Link
                to="/oferte"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#07080c] bg-[#89CFF0] hover:bg-[#70c4e8] transition-colors"
              >
                <Package className="w-3.5 h-3.5" />
                Oferte noi
              </Link>
            </div>
          </div>
        </div>

        {/* ── Info + Stats row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Contact info */}
          <div className="sm:col-span-2 rounded-2xl bg-white/[0.03] border border-white/[0.07] p-5 space-y-3">
            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Date de contact</h2>
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <Mail className="w-4 h-4 text-neutral-600 shrink-0" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <Phone className="w-4 h-4 text-neutral-600 shrink-0" />
              <span>{user.phone || <span className="text-neutral-600 italic">Niciun număr adăugat</span>}</span>
            </div>
            <div className="pt-1">
              <Link
                to="/cont/setari"
                className="text-[11px] text-[#89CFF0] hover:underline"
              >
                Completează profilul →
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-5 flex flex-col justify-between gap-4">
            <div>
              <div className="text-3xl font-extrabold text-white">{reservations.length}</div>
              <div className="text-xs text-neutral-500 mt-0.5">rezervări totale</div>
            </div>
            <div className="flex gap-4">
              <div>
                <div className="text-lg font-bold text-emerald-400">{confirmedCount}</div>
                <div className="text-[10px] text-neutral-600">confirmate</div>
              </div>
              <div>
                <div className="text-lg font-bold text-[#89CFF0]">{activeCount}</div>
                <div className="text-[10px] text-neutral-600">active</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Rezervări ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Rezervările mele</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Istoricul și statusul cererilor tale</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="p-2 rounded-full text-neutral-500 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Reîncarcă"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading && (
            <div className="py-16 flex flex-col items-center gap-3 text-neutral-500">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs">Se încarcă rezervările...</span>
            </div>
          )}

          {!loading && error && (
            <div className="py-10 px-5 rounded-2xl bg-red-500/[0.06] border border-red-500/20 text-center">
              <AlertCircle className="w-5 h-5 text-red-400 mx-auto mb-2" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {!loading && !error && reservations.length === 0 && (
            <div className="py-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center gap-4 text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                <Package className="w-6 h-6 text-neutral-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Nicio rezervare încă</p>
                <p className="text-xs text-neutral-500 mt-1">Explorează ofertele noastre și fă prima ta rezervare.</p>
              </div>
              <Link
                to="/oferte"
                className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold text-[#07080c] bg-[#89CFF0] hover:bg-[#70c4e8] transition-colors"
              >
                Explorează oferte <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {!loading && !error && reservations.length > 0 && (
            <div className="space-y-3">
              {reservations.map((r) => {
                const cfg = STATUS_CONFIG[r.status] ?? STATUS_CONFIG.noua;
                const StatusIcon = cfg.icon;
                const offer = getOffer(r.offer_id);

                return (
                  <div
                    key={r.id}
                    className="rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] transition-colors overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Offer image */}
                      {offer?.imageUrl && (
                        <div className="sm:w-32 h-28 sm:h-auto shrink-0 overflow-hidden bg-neutral-900">
                          <img
                            src={offer.imageUrl}
                            alt={offer.title}
                            className="w-full h-full object-cover opacity-80"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.color}`}>
                              <StatusIcon className={`w-3 h-3 ${r.status === 'in_progres' ? 'animate-spin' : ''}`} />
                              {cfg.label}
                            </span>
                            <span className="text-[10px] text-neutral-600">
                              #{r.id} · {new Date(r.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </div>

                          <h3 className="text-sm font-semibold text-white leading-snug">
                            {r.offer_title || offer?.title || r.offer_id}
                          </h3>

                          {offer && (
                            <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {offer.destination}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {offer.durationDays}z / {offer.durationNights}n
                              </span>
                              <span className="font-semibold text-white">
                                {offer.priceRon.toLocaleString('ro-RO')} RON
                              </span>
                            </div>
                          )}

                          {r.message && (
                            <p className="text-[11px] text-neutral-500 italic line-clamp-1">
                              "{r.message}"
                            </p>
                          )}
                        </div>

                        {/* Right action */}
                        {r.status !== 'anulata' && r.status !== 'confirmata' && (
                          <Link
                            to="/contact"
                            className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05] transition-all"
                          >
                            Contactează-ne
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                        {r.status === 'confirmata' && (
                          <div className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-emerald-300 border border-emerald-400/20 bg-emerald-400/[0.06]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirmat
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Oferte sugerate (dacă nu are rezervări sau are puține) ── */}
        {!loading && reservations.length < 2 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Oferte recomandate</h2>
              <Link to="/oferte" className="text-xs text-neutral-500 hover:text-white flex items-center gap-1 transition-colors">
                vezi toate <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TRAVEL_OFFERS.filter((o) => o.featured).slice(0, 3).map((offer) => (
                <Link
                  key={offer.id}
                  to={`/oferte`}
                  className="group rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.14] overflow-hidden transition-all"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-neutral-900">
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-[#89CFF0] font-semibold mb-1">{offer.category}</p>
                    <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-[#89CFF0] transition-colors">
                      {offer.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-neutral-500">{offer.durationDays} zile</span>
                      <span className="text-sm font-bold text-white">{offer.priceRon.toLocaleString('ro-RO')} RON</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
