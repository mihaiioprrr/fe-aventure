import React, { useEffect, useState, useCallback } from 'react';
import { Trash2, CheckCircle2, XCircle, Star } from 'lucide-react';
import { API_BASE } from '../../context/AuthContext';

interface Review {
  id: number;
  rating: number;
  body: string;
  offer_id: string;
  approved: number;
  created_at: string;
  user_name: string;
  user_email: string;
}

interface Props {
  headers: Record<string, string>;
}

export const ReviewsTab: React.FC<Props> = ({ headers }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'toate' | 'aprobate' | 'in_asteptare'>('toate');

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API_BASE}/admin/reviews.php`, { headers })
      .then((r) => r.json())
      .then((data) => { if (data.ok) setReviews(data.reviews); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleApprove = async (r: Review) => {
    await fetch(`${API_BASE}/admin/reviews.php`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ id: r.id, approved: r.approved ? 0 : 1 }),
    });
    load();
  };

  const deleteReview = async (id: number) => {
    if (!confirm('Ștergi această recenzie?')) return;
    await fetch(`${API_BASE}/admin/reviews.php`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id }),
    });
    load();
  };

  const filtered = reviews.filter((r) => {
    if (filter === 'aprobate') return r.approved === 1;
    if (filter === 'in_asteptare') return r.approved === 0;
    return true;
  });

  const pending = reviews.filter((r) => r.approved === 0).length;

  return (
    <div>
      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-6">
        {(['toate', 'in_asteptare', 'aprobate'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-[#89CFF0] text-[#07080c] font-semibold'
                : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {f === 'toate' && `Toate (${reviews.length})`}
            {f === 'in_asteptare' && (
              <span className="flex items-center gap-1.5">
                În așteptare
                {pending > 0 && (
                  <span className="w-4 h-4 rounded-full bg-yellow-400 text-[#07080c] text-[9px] font-bold flex items-center justify-center">
                    {pending}
                  </span>
                )}
              </span>
            )}
            {f === 'aprobate' && `Aprobate (${reviews.filter((r) => r.approved).length})`}
          </button>
        ))}
      </div>

      {loading && (
        <div className="py-16 text-center text-xs text-neutral-500">Se încarcă recenziile...</div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="py-16 text-center text-xs text-neutral-500">Nicio recenzie găsită.</div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className={`rounded-xl border px-5 py-4 transition-colors ${
                r.approved === 0
                  ? 'bg-yellow-400/[0.03] border-yellow-400/20'
                  : 'bg-white/[0.02] border-white/[0.07]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Stars + name */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-700'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-white">{r.user_name}</span>
                    <span className="text-[10px] text-neutral-600">{r.user_email}</span>
                    {r.approved === 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-400/15 text-yellow-300">
                        În așteptare
                      </span>
                    )}
                  </div>

                  {/* Offer */}
                  {r.offer_id && r.offer_id !== '' && (
                    <p className="text-[11px] text-[#89CFF0]">{r.offer_id}</p>
                  )}

                  {/* Body */}
                  <p className="text-sm text-neutral-300 leading-relaxed">{r.body}</p>

                  {/* Date */}
                  <p className="text-[10px] text-neutral-600">
                    {new Date(r.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleApprove(r)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      r.approved
                        ? 'text-neutral-400 border border-white/[0.08] hover:text-red-400 hover:border-red-400/20'
                        : 'text-emerald-400 border border-emerald-400/20 hover:bg-emerald-400/10'
                    }`}
                    title={r.approved ? 'Retrage aprobarea' : 'Aprobă'}
                  >
                    {r.approved
                      ? <><XCircle className="w-3.5 h-3.5" /> Retrage</>
                      : <><CheckCircle2 className="w-3.5 h-3.5" /> Aprobă</>
                    }
                  </button>
                  <button
                    onClick={() => deleteReview(r.id)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    title="Șterge"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
