import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TravelOffer } from '../types';
import { useAuth } from '../context/AuthContext';

interface OfferCardProps {
  offer: TravelOffer;
  onOpenDetails: (offer: TravelOffer) => void;
  onSelectBooking: (offer: TravelOffer) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onOpenDetails,
  onSelectBooking,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBooking = () => {
    if (!user) { navigate('/login'); return; }
    onSelectBooking(offer);
  };
  return (
    <article className="group flex flex-col rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900 cursor-pointer" onClick={() => onOpenDetails(offer)}>
        <img
          src={offer.imageUrl}
          alt={offer.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 text-xs font-medium text-white/90">
          {offer.destination} · {offer.durationDays} zile
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <h3
            onClick={() => onOpenDetails(offer)}
            className="text-base font-semibold text-white group-hover:text-[#89CFF0] transition-colors cursor-pointer"
          >
            {offer.title}
          </h3>
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {offer.shortDescription}
          </p>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-white">
              {offer.priceRon} <span className="text-xs font-normal text-neutral-400">RON</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenDetails(offer)}
              className="btn-press px-3 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10"
            >
              detalii
            </button>
            <button
              type="button"
              onClick={handleBooking}
              className="btn-primary-glow px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#07080c] bg-[#89CFF0] hover:bg-[#5bb8e8] flex items-center gap-1 shadow-sm"
            >
              <span>rezervă</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

