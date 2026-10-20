import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { TRAVEL_OFFERS } from '../data/offersData';
import { TravelOffer } from '../types';
import { OfferCard } from '../components/OfferCard';
import { OfferDetailModal } from '../components/OfferDetailModal';

export const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>(initialQuery);
  const [selectedOffer, setSelectedOffer] = useState<TravelOffer | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setSearch(initialQuery);
    }
  }, [initialQuery]);

  const categories = [
    { key: 'all', label: 'toate' },
    { key: 'Aventură Montană', label: 'munte & aventură' },
    { key: 'City Break & Cultură', label: 'city break' },
    { key: 'Circuite Școlare', label: 'circuite școlare' },
    { key: 'Litoral & Relaxare', label: 'litoral' },
    { key: 'Eco-Turism', label: 'eco-turism' },
  ];

  const filteredOffers = useMemo(() => {
    return TRAVEL_OFFERS.filter((offer) => {
      const matchCat = category === 'all' || offer.category === category;
      const q = search.toLowerCase().trim();
      const matchSearch =
        q === '' ||
        offer.title.toLowerCase().includes(q) ||
        offer.destination.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [category, search]);

  const handleBook = (offer: TravelOffer) => {
    navigate(`/rezervare?oferta=${offer.id}`);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#07080c] text-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <div className="text-xs font-semibold text-[#89CFF0] mb-1">
            — catalog turistic
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            oferte & pachete
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Alege destinația ideală pentru tine sau clasa ta.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Caută o destinație sau un traseu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors lowercase ${
                  category === cat.key
                    ? 'bg-[#89CFF0] text-[#07080c] font-semibold'
                    : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onOpenDetails={(o) => setSelectedOffer(o)}
                onSelectBooking={(o) => handleBook(o)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-neutral-500">
            Nu am găsit nicio ofertă conform căutării tale.
          </div>
        )}
      </div>

      <OfferDetailModal
        offer={selectedOffer}
        onClose={() => setSelectedOffer(null)}
        onBook={(o) => handleBook(o)}
      />
    </div>
  );
};

