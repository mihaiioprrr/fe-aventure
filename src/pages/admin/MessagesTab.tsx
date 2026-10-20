import React, { useEffect, useState, useCallback } from 'react';
import { Trash2, ChevronDown, ChevronUp, Mail, Phone, Clock } from 'lucide-react';
import { AdminReservation, STATUS_COLORS, STATUS_LABELS } from './types';
import { API_BASE } from '../../context/AuthContext';

interface Props {
  headers: Record<string, string>;
}

const STATUSES = ['noua', 'in_progres', 'confirmata', 'anulata'] as const;

const STATUS_LABEL_MESSAGES: Record<string, string> = {
  noua: 'Necitit',
  in_progres: 'În curs',
  confirmata: 'Rezolvat',
  anulata: 'Arhivat',
};

export const MessagesTab: React.FC<Props> = ({ headers }) => {
  const [messages, setMessages] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('toate');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API_BASE}/admin/reservations.php`, { headers })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          // Only show contact messages
          setMessages(data.reservations.filter((r: AdminReservation) => r.offer_id === 'contact'));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered =
    filterStatus === 'toate'
      ? messages
      : messages.filter((r) => r.status === filterStatus);

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

  const deleteMessage = async (id: number) => {
    if (!confirm('Ștergi acest mesaj?')) return;
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
            {f === 'toate' ? 'Toate' : STATUS_LABEL_MESSAGES[f]}
            <span className="ml-1 opacity-60">
              ({f === 'toate'
                ? messages.length
                : messages.filter((r) => r.status === f).length})
            </span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="py-16 text-center text-xs text-neutral-500">Se încarcă mesajele...</div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="py-16 text-center text-xs text-neutral-500">Niciun mesaj găsit.</div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((r) => {
            const isExpanded = expandedId === r.id;
            const isUnread = r.status === 'noua';

            return (
              <div
                key={r.id}
                className={`rounded-xl border transition-colors overflow-hidden ${
                  isUnread
                    ? 'bg-[#89CFF0]/[0.04] border-[#89CFF0]/20'
                    : 'bg-white/[0.02] border-white/[0.06]'
                }`}
              >
                {/* Row header — always visible */}
                <div
                  className="px-5 py-4 flex items-center gap-4 cursor-pointer"
                  onClick={() => {
                    setExpandedId(isExpanded ? null : r.id);
                    // Mark as in_progres when opened if still 'noua'
                    if (!isExpanded && r.status === 'noua') {
                      updateStatus(r.id, 'in_progres');
                    }
                  }}
                >
                  {/* Unread dot */}
                  <div className={`w-2 h-2 rounded-full shrink-0 ${isUnread ? 'bg-[#89CFF0]' : 'bg-transparent'}`} />

                  {/* Sender */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold ${isUnread ? 'text-white' : 'text-neutral-300'}`}>
                        {r.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLORS[r.status]}`}>
                        {STATUS_LABEL_MESSAGES[r.status]}
                      </span>
                    </div>
                    {/* Subject */}
                    <p className={`text-xs mt-0.5 truncate ${isUnread ? 'text-neutral-300 font-medium' : 'text-neutral-500'}`}>
                      {r.offer_title && r.offer_title !== 'Mesaj general' ? r.offer_title : 'Mesaj general'}
                    </p>
                  </div>

                  {/* Date + expand */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1 text-[10px] text-neutral-600">
                      <Clock className="w-3 h-3" />
                      {new Date(r.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
                    </div>
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-neutral-500" />
                      : <ChevronDown className="w-4 h-4 text-neutral-500" />
                    }
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-white/[0.06] pt-4 space-y-4">
                    {/* Sender details */}
                    <div className="flex flex-wrap gap-4 text-xs text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-neutral-600" />
                        <a href={`mailto:${r.email}`} className="hover:text-white transition-colors">{r.email}</a>
                      </div>
                      {r.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-neutral-600" />
                          {r.phone}
                        </div>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Subiect</div>
                      <div className="text-sm text-white font-medium">
                        {r.offer_title || 'Mesaj general'}
                      </div>
                    </div>

                    {/* Message body */}
                    {r.message && (
                      <div>
                        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Mesaj</div>
                        <div className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap bg-white/[0.02] rounded-xl p-4 border border-white/[0.05]">
                          {r.message}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-4 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-neutral-500">Marchează ca:</span>
                        <div className="flex gap-1.5">
                          {STATUSES.filter((s) => s !== r.status).map((s) => (
                            <button
                              key={s}
                              disabled={updatingId === r.id}
                              onClick={() => updateStatus(r.id, s)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors disabled:opacity-40 ${STATUS_COLORS[s]} hover:opacity-80`}
                            >
                              {STATUS_LABEL_MESSAGES[s]}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${r.email}?subject=Re: ${r.offer_title || 'Mesajul tău'}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#89CFF0] border border-[#89CFF0]/30 hover:bg-[#89CFF0]/10 transition-colors"
                        >
                          <Mail className="w-3 h-3" /> Răspunde
                        </a>
                        <button
                          onClick={() => deleteMessage(r.id)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          title="Șterge"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
