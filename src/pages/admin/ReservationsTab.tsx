import React, { useEffect, useState, useCallback } from 'react';
import { Trash2, ChevronDown } from 'lucide-react';
import { AdminReservation, STATUS_COLORS, STATUS_LABELS } from './types';
import { API_BASE } from '../../context/AuthContext';

interface Props {
  headers: Record<string, string>;
}

const STATUSES = ['noua', 'in_progres', 'confirmata', 'anulata'] as const;

export const ReservationsTab: React.FC<Props> = ({ headers }) => {
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('toate');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API_BASE}/admin/reservations.php`, { headers })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          // Exclude contact messages — those go to MessagesTab
          setReservations(data.reservations.filter((r: AdminReservation) => r.offer_id !== 'contact'));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered =
    filterStatus === 'toate'
      ? reservations
      : reservations.filter((r) => r.status === filterStatus);

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    await fetch(`${API_BASE}/admin/reservations.php`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ id, status }),
    });
    setUpdatingId(null);
    load();
  };

  const deleteReservation = async (id: number) => {
    if (!confirm('Ștergi această rezervare?')) return;
    await fetch(`${API_BASE}/admin/reservations.php`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id }),
    });
    load();
  };

  const allFilters = ['toate', ...STATUSES];

  return (
    <div>
      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {allFilters.map((f) => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filterStatus === f
                ? 'bg-[#89CFF0] text-[#07080c] font-semibold'
                : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {f === 'toate' ? 'Toate' : STATUS_LABELS[f]}
            {f === 'toate'
              ? ` (${reservations.length})`
              : ` (${reservations.filter((r) => r.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-neutral-500">Se încarcă rezervările...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-xs text-neutral-500">Nicio rezervare găsită.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="rounded-xl bg-white/[0.03] border border-white/[0.07] px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">{r.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLORS[r.status]}`}>
                    {STATUS_LABELS[r.status]}
                  </span>
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">{r.email} · {r.phone}</div>
                <div className="text-xs text-[#89CFF0] mt-1 font-medium">{r.offer_title || r.offer_id}</div>
                {r.message && (
                  <div className="text-xs text-neutral-500 mt-1 italic line-clamp-1">"{r.message}"</div>
                )}
              </div>

              {/* Right side */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-[10px] text-neutral-600 whitespace-nowrap">
                  {new Date(r.created_at).toLocaleDateString('ro-RO')}
                </div>
                {/* Status dropdown */}
                <div className="relative">
                  <select
                    value={r.status}
                    disabled={updatingId === r.id}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs text-white focus:outline-none focus:border-[#89CFF0]/50 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-[#0d0f14]">
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-500" />
                </div>
                <button
                  onClick={() => deleteReservation(r.id)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  title="Șterge"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
