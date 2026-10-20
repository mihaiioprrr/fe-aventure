import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, CalendarCheck, Users, Compass, LogOut, Star, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StatsTab } from './StatsTab';
import { OffersTab } from './OffersTab';
import { ReservationsTab } from './ReservationsTab';
import { UsersTab } from './UsersTab';
import { ReviewsTab } from './ReviewsTab';
import { ChatTab } from './ChatTab';

type Tab = 'stats' | 'offers' | 'reservations' | 'reviews' | 'chat' | 'users';

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'stats',        label: 'Prezentare',  icon: LayoutDashboard },
  { key: 'offers',       label: 'Oferte',      icon: Package },
  { key: 'reservations', label: 'Rezervări',   icon: CalendarCheck },
  { key: 'reviews',      label: 'Recenzii',    icon: Star },
  { key: 'chat',         label: 'Chat Live',   icon: MessageCircle },
  { key: 'users',        label: 'Utilizatori', icon: Users },
];

export const AdminPage: React.FC = () => {
  const { user, isAdmin, logout, adminHeaders } = useAuth();
  const [tab, setTab] = useState<Tab>('stats');

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const headers = adminHeaders();

  const descriptions: Record<Tab, string> = {
    stats:        'Rezumatul activității agenției',
    offers:       'Administrează pachetele turistice',
    reservations: 'Gestionează cererile de rezervare',
    reviews:      'Moderează recenziile trimise de utilizatori',
    chat:         'Conversații live cu utilizatorii',
    users:        'Conturi înregistrate pe platformă',
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-white flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#07080c]/95 backdrop-blur-xl border-b border-white/[0.06] flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#89CFF0]/10 border border-[#89CFF0]/30 flex items-center justify-center text-[#89CFF0]">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold tracking-tight text-white text-sm">
              aventure<span className="text-[#89CFF0]">.</span>
              <span className="ml-1.5 text-[10px] font-semibold text-neutral-500 uppercase tracking-widest align-middle">admin</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500 hidden sm:inline">{user.name}</span>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-neutral-400 hover:text-white border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05] transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Ieși</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-14 max-w-6xl mx-auto w-full px-4 sm:px-6 gap-6 py-8">
        <aside className="hidden md:flex flex-col gap-1 w-48 shrink-0 pt-2">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                tab === key
                  ? 'bg-[#89CFF0]/10 text-[#89CFF0]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </aside>

        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07080c]/95 backdrop-blur-xl border-t border-white/[0.06] flex">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
                tab === key ? 'text-[#89CFF0]' : 'text-neutral-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <main className="flex-1 min-w-0 pb-20 md:pb-0">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              {TABS.find((t) => t.key === tab)?.label}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">{descriptions[tab]}</p>
          </div>

          {tab === 'stats'        && <StatsTab        headers={headers} />}
          {tab === 'offers'       && <OffersTab        headers={headers} />}
          {tab === 'reservations' && <ReservationsTab  headers={headers} />}
          {tab === 'reviews'      && <ReviewsTab       headers={headers} />}
          {tab === 'chat'         && <ChatTab          headers={headers} />}
          {tab === 'users'        && <UsersTab         headers={headers} currentUserId={user.id} />}
        </main>
      </div>
    </div>
  );
};
