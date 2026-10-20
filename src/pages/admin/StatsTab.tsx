import React, { useEffect, useState } from 'react';
import { Users, Calendar, Star, Package, Clock } from 'lucide-react';
import { AdminStats, AdminReservation, STATUS_COLORS, STATUS_LABELS } from './types';
import { API_BASE } from '../../context/AuthContext';

interface Props {
  headers: Record<string, string>;
}

export const StatsTab: React.FC<Props> = ({ headers }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recent, setRecent] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/admin/stats.php`, { headers })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setStats(data.stats);
          setRecent(data.recent_reservations ?? []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-neutral-500 text-sm">
        Se încarcă statisticile...
      </div>
    );
  }

  const tiles = [
    { label: 'Utilizatori', value: stats?.users ?? 0, icon: Users, color: 'text-[#89CFF0]', bg: 'bg-[#89CFF0]/10' },
    { label: 'Rezervări totale', value: stats?.reservations ?? 0, icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Rezervări noi', value: stats?.new_res ?? 0, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Oferte active', value: stats?.offers ?? 0, icon: Package, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-5 flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">{value}</div>
              <div className="text-xs text-neutral-500 mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
          <Clock className="w-4 h-4 text-neutral-500" />
          <h3 className="text-sm font-semibold text-white">Ultimele rezervări</h3>
        </div>
        {recent.length === 0 ? (
          <div className="py-10 text-center text-xs text-neutral-500">Nu există rezervări recente.</div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {recent.map((r: any, i: number) => (
              <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-white">{r.name}</div>
                  <div className="text-xs text-neutral-500">{r.email}</div>
                </div>
                <div className="text-right shrink-0">
                  {r.status && (
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLORS[r.status] ?? 'bg-white/10 text-white'}`}>
                      {STATUS_LABELS[r.status] ?? r.status}
                    </span>
                  )}
                  <div className="text-[10px] text-neutral-600 mt-0.5">
                    {new Date(r.created_at).toLocaleDateString('ro-RO')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
