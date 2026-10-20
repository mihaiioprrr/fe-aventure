import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, Star, Send } from 'lucide-react';
import { TRAVEL_OFFERS } from '../data/offersData';
import { OfferCard } from '../components/OfferCard';
import { OfferDetailModal } from '../components/OfferDetailModal';
import { TravelOffer } from '../types';
import { useAuth, API_BASE } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchDestination, setSearchDestination] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<TravelOffer | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Reviews state
  interface Review { id: number; rating: number; body: string; offer_id: string; created_at: string; user_name: string; }
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewBody, setReviewBody] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/review.php`)
      .then((r) => r.json())
      .then((data) => { if (data.ok) setReviews(data.reviews); })
      .catch(() => {});
  }, [reviewDone]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !reviewBody.trim()) return;
    setReviewSubmitting(true);
    setReviewError('');
    try {
      const res = await fetch(`${API_BASE}/review.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': String(user.id),
          'X-User-Email': user.email,
        },
        body: JSON.stringify({ rating: reviewRating, body: reviewBody.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        setReviewDone(true);
        setReviewBody('');
        setReviewRating(5);
      } else {
        setReviewError(data.error ?? 'Eroare la trimitere.');
      }
    } catch {
      setReviewError('Serverul nu este accesibil.');
    }
    setReviewSubmitting(false);
  };

  const featuredOffers = TRAVEL_OFFERS.slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchDestination.trim()) {
      navigate(`/oferte?q=${encodeURIComponent(searchDestination.trim())}`);
    } else {
      navigate('/oferte');
    }
  };

  const faqs = [
    {
      q: 'Este F.E. Aventure o agenție oficială de liceu?',
      a: 'Da! Suntem o firmă de exercițiu înființată în cadrul profilului servicii și turism. Simulăm toate operațiunile unei agenții reale conform curriculei naționale și centralei ROCT.'
    },
    {
      q: 'Cum pot rezerva un pachet turistic?',
      a: 'Alegi destinația dorită din catalog și completezi formularul simplu de contact. Îți confirmăm disponibilitatea și îți trimitem dosarul de călătorie în cel mai scurt timp.'
    },
    {
      q: 'Pot veni și clase întregi sau grupuri de elevi?',
      a: 'Desigur. Oferim pachete speciale de grup cu gratuități garantate pentru profesorii însoțitori (1 loc gratuit la fiecare 10 elevi) și activități personalizate.'
    },
    {
      q: 'Ce este inclus în tarifele afișate?',
      a: 'Fiecare pachet include transportul cu autocar clasificat, cazarea la unități verificate, mesele menționate și ghidul însoțitor. Fără taxe ascunse.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#07080c] text-white">
      <section className="relative min-h-[92vh] flex flex-col justify-center items-center px-6 pt-24 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
            alt="Ocean and coast atmosphere"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-[#07080c]/60 to-[#07080c]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_#07080c_90%)]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="text-xs font-semibold tracking-wider text-[#89CFF0]">
            — alege aventura ta
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08]">
            <span className="block text-white">o călătorie.</span>
            <span className="block coral-gradient-text">toată lumea ta.</span>
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            aventure este agenția ta de călătorii — trasee montane, city break-uri culturale și escapade de neuitat. Fără bătăi de cap, doar experiențe pure pentru liceeni.
          </p>



          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-xl mx-auto"
          >
            <div className="misa-input rounded-full p-1.5 sm:p-2 flex items-center transition-all">
              <span className="pl-4 pr-1 text-xs sm:text-sm font-semibold text-neutral-400 select-none">
                aventure.ro/
              </span>
              <input
                type="text"
                placeholder="destinație sau circuit..."
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none px-2"
              />
              <button
                type="submit"
                className="btn-primary-glow flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-[#07080c] bg-[#89CFF0] hover:bg-[#5bb8e8] shrink-0 cursor-pointer shadow-md shadow-[#89CFF0]/20"
              >
                <span>explorează</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-[11px] text-neutral-500 mt-2.5 tracking-wide">
              3–7 zile · munte, mare, orașe · prețuri speciale de licean
            </div>
          </form>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center space-y-8 border-t border-white/[0.05]">
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300 font-normal leading-relaxed">
          Turismul pentru liceeni nu ar trebui să fie plictisitor sau inaccesibil. F.E. Aventure este alternativa: itinerarii dinamice, prețuri corecte și libertate deplină. Povești reale, create pentru generația ta.
        </p>

        <div className="flex items-center justify-center gap-6 text-xs text-neutral-500 uppercase tracking-widest font-semibold">
          <Link to="/" className="hover:text-white transition-colors">DESPRE</Link>
          <span className="text-neutral-700">·</span>
          <Link to="/contact" className="hover:text-white transition-colors">SUPORT</Link>
          <span className="text-neutral-700">·</span>
          <Link to="/oferte" className="hover:text-white transition-colors">OFERTE</Link>
        </div>
      </section>

      {/* ── Misiune & Viziune ── */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-white/[0.05]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Misiune */}
          <div className="rounded-lg border border-white/[0.08] p-8 space-y-5">
            <p className="text-xs font-semibold text-[#89CFF0] uppercase tracking-widest">Misiunea noastră</p>
            <h3 className="text-xl font-extrabold text-white leading-snug tracking-tight">
              Facem turismul accesibil pentru fiecare licean
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              F.E. Aventure există pentru a demonstra că o excursie de calitate nu trebuie să fie scumpă sau complicată. Construim itinerarii reale, cu prețuri corecte și experiențe autentice — direct pentru generația care vrea să exploreze lumea.
            </p>
            <ul className="space-y-2.5 pt-1">
              {[
                'Prețuri transparente, fără taxe ascunse',
                'Pachete adaptate grupurilor școlare',
                'Ghizi însoțitori atestați pe fiecare circuit',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-xs text-neutral-600">
                  <span className="w-1 h-1 rounded-full bg-[#89CFF0] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Viziune */}
          <div className="rounded-lg border border-white/[0.08] p-8 space-y-5">
            <p className="text-xs font-semibold text-[#89CFF0] uppercase tracking-widest">Viziunea noastră</p>
            <h3 className="text-xl font-extrabold text-white leading-snug tracking-tight">
              Să devenim referința turismului liceal din România
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Vrem ca fiecare elev din România să aibă acces la o excursie memorabilă înainte de absolvire. O agenție construită de tineri, pentru tineri — unde fiecare detaliu contează și fiecare călătorie lasă o urmă.
            </p>
            <ul className="space-y-2.5 pt-1">
              {[
                'O rețea națională de parteneri verificați',
                'Experiențe educative integrate în fiecare tur',
                'Sustenabilitate și respect față de natură',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-xs text-neutral-600">
                  <span className="w-1 h-1 rounded-full bg-[#89CFF0] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-white/[0.05]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-semibold text-[#89CFF0] mb-1">
              — destinații de top
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              pachete populare
            </h2>
          </div>
          <Link
            to="/oferte"
            className="text-xs font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>vezi tot catalogul</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onOpenDetails={(o) => setSelectedOffer(o)}
              onSelectBooking={(o) => navigate(`/rezervare?oferta=${o.id}`)}
            />
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <div className="text-xs font-semibold text-[#89CFF0]">
              — faq
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              quick answers
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="border-b border-white/[0.08] pb-3"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="btn-press w-full py-2 flex items-center justify-between text-left text-sm font-semibold text-white hover:text-[#89CFF0]"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#89CFF0] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-neutral-400 leading-relaxed pt-2 pb-1 pr-6 animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

          <div className="text-center pt-8">
            <Link
              to="/contact"
              className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider font-semibold"
            >
              AI O ÎNTREBARE? CONTACTEAZĂ-NE →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Recenzii ── */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/[0.05]">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-xs font-semibold text-[#89CFF0] mb-1">— ce spun cei care au călătorit</div>
            <h2 className="text-2xl font-bold text-white tracking-tight">recenzii</h2>
          </div>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-neutral-400">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-white">
                {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
              </span>
              <span className="text-neutral-600">({reviews.length})</span>
            </div>
          )}
        </div>

        {/* Cards recenzii */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {reviews.slice(0, 6).map((r) => (
              <div key={r.id} className="rounded-lg border border-white/[0.08] p-5 space-y-3 flex flex-col">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-700'}`} />
                  ))}
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed flex-1">"{r.body}"</p>
                <div className="pt-1 border-t border-white/[0.05]">
                  <p className="text-xs font-semibold text-white">{r.user_name}</p>
                  <p className="text-[10px] text-neutral-600 mt-0.5">
                    {new Date(r.created_at).toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-12 py-10 text-center text-xs text-neutral-600">
            Nicio recenzie aprobată încă. Fii primul!
          </div>
        )}

        {/* Formular recenzie */}
        <div className="max-w-xl mx-auto">
          <div className="rounded-lg border border-white/[0.08] p-6">
            {!user ? (
              <div className="text-center space-y-3 py-4">
                <p className="text-sm text-neutral-400">Loghează-te pentru a lăsa o recenzie.</p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold text-[#07080c] bg-[#89CFF0] hover:bg-[#70c4e8] transition-colors"
                >
                  Intră în cont <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : reviewDone ? (
              <div className="text-center space-y-2 py-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                  <Star className="w-5 h-5 fill-emerald-400" />
                </div>
                <p className="text-sm font-semibold text-white">Recenzie trimisă!</p>
                <p className="text-xs text-neutral-500">Va apărea după aprobare de către echipa noastră.</p>
                <button
                  type="button"
                  onClick={() => setReviewDone(false)}
                  className="text-xs text-neutral-600 hover:text-white transition-colors"
                >
                  Trimite alta
                </button>
              </div>
            ) : (
              <form onSubmit={submitReview} className="space-y-4">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Lasă o recenzie</p>

                {/* Star picker */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const val = i + 1;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReviewRating(val)}
                        onMouseEnter={() => setReviewHover(val)}
                        onMouseLeave={() => setReviewHover(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star className={`w-6 h-6 transition-colors ${
                          val <= (reviewHover || reviewRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-neutral-700'
                        }`} />
                      </button>
                    );
                  })}
                </div>

                <textarea
                  rows={3}
                  required
                  placeholder="Spune-ne cum a fost experiența ta..."
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/40 transition-colors resize-none"
                />

                {reviewError && (
                  <p className="text-xs text-red-400">{reviewError}</p>
                )}

                <button
                  type="submit"
                  disabled={reviewSubmitting || !reviewBody.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-[#07080c] bg-[#89CFF0] hover:bg-[#70c4e8] disabled:opacity-40 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  {reviewSubmitting ? 'Se trimite...' : 'Trimite recenzia'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <OfferDetailModal
        offer={selectedOffer}
        onClose={() => setSelectedOffer(null)}
        onBook={(o) => navigate(`/rezervare?oferta=${o.id}`)}
      />
    </div>
  );
};


