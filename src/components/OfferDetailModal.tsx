import React from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TravelOffer } from '../types';
import { useAuth } from '../context/AuthContext';

interface OfferDetailModalProps {
  offer: TravelOffer | null;
  onClose: () => void;
  onBook: (offer: TravelOffer) => void;
}

export const OfferDetailModal: React.FC<OfferDetailModalProps> = ({
  offer,
  onClose,
  onBook,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBook = () => {
    if (!user) { onClose(); navigate('/login'); return; }
    onBook(offer!);
    onClose();
  };

  if (!offer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl rounded-2xl bg-[#0c101a] border border-white/10 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        <div className="relative h-48 w-full shrink-0">
          <img
            src={offer.imageUrl}
            alt={offer.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c101a] via-transparent to-black/40" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-neutral-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-5 right-5">
            <div className="text-[11px] text-[#89CFF0] font-medium">
              {offer.destination} · {offer.durationDays} zile
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">
              {offer.title}
            </h2>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs text-neutral-300">
          <p className="leading-relaxed text-neutral-300 text-sm">
            {offer.fullDescription}
          </p>

          <div className="space-y-2">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              Ce este inclus
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {offer.includedServices.map((inc, i) => (
                <div key={i} className="flex items-center gap-2 text-neutral-300">
                  <Check className="w-3.5 h-3.5 text-[#89CFF0] shrink-0" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              Program pe scurt
            </h4>
            <div className="space-y-2">
              {offer.itinerary.map((item) => (
                <div key={item.day} className="flex gap-2">
                  <span className="font-bold text-white shrink-0">Ziua {item.day}:</span>
                  <span className="text-neutral-400">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-[#090d16] flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-400">Preț / persoană</div>
            <div className="text-xl font-bold text-white">
              {offer.priceRon} <span className="text-xs font-normal text-neutral-400">RON</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn-press px-4 py-2 rounded-full text-xs font-medium text-neutral-400 hover:text-white"
            >
              închide
            </button>
            <button
              onClick={() => {
                handleBook();
              }}
              className="btn-primary-glow px-5 py-2 rounded-full text-xs font-semibold text-[#07080c] bg-[#89CFF0] hover:bg-[#5bb8e8] flex items-center gap-1.5 shadow-md shadow-[#89CFF0]/20"
            >
              <span>mergi la rezervare</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

