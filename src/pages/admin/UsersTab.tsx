import React, { useEffect, useState, useCallback } from 'react';
import { Trash2, ShieldCheck, ShieldOff } from 'lucide-react';
import { AdminUser } from './types';
import { API_BASE } from '../../context/AuthContext';

interface Props {
  headers: Record<string, string>;
  currentUserId: number;
}

export const UsersTab: React.FC<Props> = ({ headers, currentUserId }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API_BASE}/admin/users.php`, { headers })
      .then((r) => r.json())
      .then((data) => { if (data.ok) setUsers(data.users); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleRole = async (user: AdminUser) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const label = newRole === 'admin' ? 'promova la admin' : 'retrograda la user';
    if (!confirm(`Vrei să ${label} pe ${user.name}?`)) return;
    await fetch(`${API_BASE}/admin/users.php`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ id: user.id, role: newRole }),
    });
    load();
  };

  const deleteUser = async (user: AdminUser) => {
    if (!confirm(`Ștergi contul lui ${user.name}?`)) return;
    await fetch(`${API_BASE}/admin/users.php`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id: user.id }),
    });
    load();
  };

  return (
    <div>
      {loading ? (
        <div className="py-16 text-center text-xs text-neutral-500">Se încarcă utilizatorii...</div>
      ) : users.length === 0 ? (
        <div className="py-16 text-center text-xs text-neutral-500">Niciun utilizator înregistrat.</div>
      ) : (
        <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Utilizator</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider hidden sm:table-cell">Data nașterii</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Rol</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Înregistrat</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {users.map((u) => {
                const isSelf = u.id === currentUserId;
                return (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-neutral-500 mt-0.5">{u.email}</div>
                    </td>
                    <td className="px-4 py-3.5 text-neutral-400 hidden sm:table-cell">
                      {u.birthdate ? new Date(u.birthdate).toLocaleDateString('ro-RO') : '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          u.role === 'admin'
                            ? 'bg-[#89CFF0]/15 text-[#89CFF0]'
                            : 'bg-white/[0.06] text-neutral-400'
                        }`}
                      >
                        {u.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-neutral-500 hidden md:table-cell">
                      {new Date(u.created_at).toLocaleDateString('ro-RO')}
                    </td>
                    <td className="px-4 py-3.5">
                      {!isSelf && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleRole(u)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              u.role === 'admin'
                                ? 'text-neutral-500 hover:text-yellow-400 hover:bg-yellow-400/10'
                                : 'text-neutral-500 hover:text-[#89CFF0] hover:bg-[#89CFF0]/10'
                            }`}
                            title={u.role === 'admin' ? 'Retrogradează la user' : 'Promovează la admin'}
                          >
                            {u.role === 'admin' ? (
                              <ShieldOff className="w-3.5 h-3.5" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteUser(u)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                            title="Șterge cont"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                      {isSelf && (
                        <span className="text-[10px] text-neutral-600 pr-1">tu</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
