import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, ArrowRight, MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '../data/offersData';
import { useAuth } from '../context/AuthContext';

export const ContactPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">

        {/* Header */}
        <div className="mb-10">
          <div className="text-xs font-semibold text-[#89CFF0] mb-1">— suntem aici pentru tine</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Contactează-ne</h1>
          <p className="text-sm text-neutral-400 mt-2">
            Ai o întrebare sau vrei să afli mai multe? Găsești mai jos toate modalitățile prin care ne poți contacta.
          </p>
        </div>

        <div className="space-y-4">

          {/* Info card */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6 space-y-4">
            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Date de contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-3 text-sm text-neutral-300 hover:text-white transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0 group-hover:border-[#89CFF0]/30 group-hover:bg-[#89CFF0]/10 transition-all">
                  <Mail className="w-4 h-4 text-neutral-500 group-hover:text-[#89CFF0] transition-colors" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-600 uppercase tracking-wider mb-0.5">Email</div>
                  {COMPANY_INFO.email}
                </div>
              </a>

              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-neutral-500" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-600 uppercase tracking-wider mb-0.5">Telefon</div>
                  {COMPANY_INFO.phone}
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-neutral-500" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-600 uppercase tracking-wider mb-0.5">Locație</div>
                  {COMPANY_INFO.location}
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-neutral-500" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-600 uppercase tracking-wider mb-0.5">Program</div>
                  {COMPANY_INFO.schedule}
                </div>
              </div>
            </div>
          </div>

          {/* Chat CTA */}
          <div className="rounded-2xl bg-[#89CFF0]/[0.06] border border-[#89CFF0]/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#89CFF0]" />
                <h3 className="text-sm font-bold text-white">Chat live cu echipa noastră</h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Cel mai rapid mod de a ne contacta. Răspundem în timp real.
              </p>
            </div>
            {user ? (
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-neutral-400">Apasă iconița de chat din colțul din dreapta jos →</span>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[#07080c] bg-[#89CFF0] hover:bg-[#70c4e8] transition-colors shrink-0"
              >
                Loghează-te pentru chat <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Booking CTA */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Vrei să rezervi o excursie?</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Alege un pachet din catalog și completează formularul de rezervare.
              </p>
            </div>
            <Link
              to="/oferte"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-neutral-300 border border-white/10 hover:border-white/20 hover:text-white transition-colors shrink-0"
            >
              Vezi ofertele <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
