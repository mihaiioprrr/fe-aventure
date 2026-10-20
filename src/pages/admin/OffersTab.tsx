import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Star, Search } from 'lucide-react';
import { AdminOffer } from './types';
import { OfferForm } from './OfferForm';
import { API_BASE } from '../../context/AuthContext';

interface Props {
  headers: Record<string, string>;
}

export const OffersTab: React.FC<Props> = ({ headers }) => {
  const [offers, setOffers] = useState<AdminOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editOffer, setEditOffer] = useState<AdminOffer | null | undefined>(undefined);
  // undefined = modal closed, null = add new, AdminOffer = edit
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API_BASE}/admin/offers.php`, { headers })
      .then((r) => r.json())
      .then((data) => { if (data.ok) setOffers(data.offers); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = offers.filter(
    (o) =>
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.destination.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Partial<AdminOffer>) => {
    const isEdit = !!editOffer;
    const method = isEdit ? 'PATCH' : 'POST';
    const body = isEdit ? { ...data, id: editOffer!.id } : data;

    const res = await fetch(`${API_BASE}/admin/offers.php`, {
      method,
      headers,
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error ?? 'Eroare necunoscută.');
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Ești sigur că vrei să ștergi această ofertă?')) return;
    setDeletingId(id);
    await fetch(`${API_BASE}/admin/offers.php`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id }),
    });
    setDeletingId(null);
    load();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Caută ofertă..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
          />
        </div>
        <button
          onClick={() => setEditOffer(null)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[#07080c] bg-[#89CFF0] hover:bg-[#70c4e8] transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Ofertă nouă
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-neutral-500">Se încarcă ofertele...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-xs text-neutral-500">
          {search ? 'Nicio ofertă găsită.' : 'Nu există oferte în baza de date.'}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Ofertă</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Categorie</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider hidden sm:table-cell">Durată</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Preț</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((offer) => (
                <tr key={offer.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {offer.image_url && (
                        <img
                          src={offer.image_url}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover shrink-0 bg-neutral-800"
                        />
                      )}
                      <div>
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {offer.title}
                          {!!offer.featured && (
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />
                          )}
                        </div>
                        <div className="text-neutral-500 mt-0.5">{offer.destination}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-neutral-400 hidden md:table-cell">{offer.category}</td>
                  <td className="px-4 py-3.5 text-neutral-400 hidden sm:table-cell whitespace-nowrap">
                    {offer.duration_days}z / {offer.duration_nights}n
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-white whitespace-nowrap">
                    {offer.price_ron.toLocaleString('ro-RO')} RON
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditOffer(offer)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-[#89CFF0] hover:bg-[#89CFF0]/10 transition-colors"
                        title="Editează"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(offer.id)}
                        disabled={deletingId === offer.id}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-40"
                        title="Șterge"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editOffer !== undefined && (
        <OfferForm
          initial={editOffer}
          onSave={handleSave}
          onClose={() => setEditOffer(undefined)}
        />
      )}
    </>
  );
};
