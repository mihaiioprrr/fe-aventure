import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { COMPANY_INFO } from '../data/offersData';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.06] bg-[#07080c] pt-16 pb-12 text-xs text-neutral-400">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-16">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 group inline-flex">
              <div className="w-6 h-6 rounded-full bg-[#181216] border border-[#89CFF0]/40 flex items-center justify-center text-[#89CFF0]">
                <Compass className="w-3 h-3" />
              </div>
              <span className="font-extrabold tracking-tight text-white text-base">
                aventure<span className="text-[#89CFF0]">.</span>
              </span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Agenția ta de turism pentru liceu. Circuite montane, city break-uri și escapade create special pentru tineri.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">
              Agenție
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Prezentare Generală
                </Link>
              </li>
              <li>
                <Link to="/oferte" className="hover:text-white transition-colors">
                  Catalog Oferte
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Rezervări
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">
              Didactic & Legal
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>Firmă de Exercițiu Liceală</li>
              <li>Rețeaua Națională ROCT</li>
              <li>Activitate Didactică Simulată</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex justify-center">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 120 60" className="h-10 w-auto shrink-0" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="60" fill="none"/>
                <polygon points="5,4 35,4 35,36 20,44 5,36" fill="#4557a0"/>
                <polygon points="8,7 32,7 32,34 20,41 8,34" fill="#5568b8"/>
                <rect x="12" y="13" width="16" height="2" fill="white" rx="1"/>
                <rect x="12" y="18" width="16" height="2" fill="white" rx="1"/>
                <rect x="12" y="23" width="16" height="2" fill="white" rx="1"/>
                <polygon points="5,36 20,44 35,36 35,40 20,48 5,40" fill="#3446880" opacity="0.4"/>
                <text x="42" y="17" fill="#4557a0" fontSize="7.5" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="0.3">CENTRUL NAȚIONAL</text>
                <text x="42" y="27" fill="#4557a0" fontSize="7.5" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="0.3">DE DEZVOLTARE A</text>
                <text x="42" y="37" fill="#4557a0" fontSize="7.5" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="0.3">ÎNVĂȚĂMÂNTULUI</text>
                <text x="42" y="47" fill="#7a88bb" fontSize="6" fontFamily="Arial,sans-serif" letterSpacing="0.2">PROFESIONAL ȘI TEHNIC</text>
              </svg>
            </div>
            <div className="text-[10px] text-neutral-500 leading-relaxed">
              <div className="text-neutral-300 font-semibold text-[11px]">Colegiul Economic Virgil Madgearu</div>
              <div className="text-neutral-500">Galați, județul Galați</div>
              <div>ID: <span className="text-[#89CFF0] font-medium">327432</span> · înreg. 21.09.2026</div>
              <div className="mt-1 text-[10px] text-neutral-600 uppercase tracking-widest font-semibold">Uz didactic</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


