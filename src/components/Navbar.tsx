import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Menu, X, LogOut, User, LayoutDashboard, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const links = [
    { path: '/', label: 'prezentare' },
    { path: '/oferte', label: 'oferte' },
    { path: '/contact', label: 'contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#07080c]/90 backdrop-blur-xl border-b border-white/[0.05] flex items-center">
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 flex items-center justify-between">

        <Link to="/" className="nav-link flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#89CFF0]/10 border border-[#89CFF0]/30 flex items-center justify-center text-[#89CFF0] shadow-sm shadow-[#89CFF0]/10 group-hover:bg-[#89CFF0]/20 transition-all duration-200">
            <Compass className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
          </div>
          <span className="font-extrabold tracking-tight text-white text-base flex items-center">
            aventure<span className="text-[#89CFF0]">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-[13px] font-normal text-neutral-400">
          {links.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link relative px-4 py-1.5 rounded-full lowercase ${
                  active
                    ? 'text-white font-medium bg-white/[0.06]'
                    : 'hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {active && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#89CFF0]" />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <Link
            to="/oferte"
            className="btn-press px-4 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white border border-white/[0.08] hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.07]"
          >
            catalog
          </Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                className="btn-press flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-neutral-300 hover:text-white hover:border-white/20 hover:bg-white/[0.07] transition-all"
              >
                <User className="w-3.5 h-3.5 text-[#89CFF0]" />
                <span className="max-w-[110px] truncate">{user.name}</span>
                <ChevronDown className={`w-3 h-3 text-neutral-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-[#0d0f14] border border-white/[0.09] shadow-2xl shadow-black/60 overflow-hidden py-1.5">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                    <div className="text-[10px] text-neutral-500 truncate mt-0.5">{user.email}</div>
                    {isAdmin && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#89CFF0]/15 text-[#89CFF0] uppercase tracking-wider">
                        Admin
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      to="/cont/profil"
                      className="flex items-center gap-3 px-4 py-2.5 text-xs text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <User className="w-3.5 h-3.5 shrink-0" />
                      Profilul meu
                    </Link>
                    <Link
                      to="/cont/setari"
                      className="flex items-center gap-3 px-4 py-2.5 text-xs text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 shrink-0" />
                      Setări cont
                    </Link>

                    {isAdmin && (
                      <>
                        <div className="mx-3 my-1 border-t border-white/[0.06]" />
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-xs text-[#89CFF0] hover:bg-[#89CFF0]/10 transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                          Admin Dashboard
                        </Link>
                      </>
                    )}

                    <div className="mx-3 my-1 border-t border-white/[0.06]" />
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/[0.06] transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 shrink-0" />
                      Deconectare
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-press px-4 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white border border-white/[0.08] hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.07]"
              >
                intră în cont
              </Link>
              <Link
                to="/register"
                className="btn-primary-glow px-4 py-1.5 rounded-full text-xs font-semibold text-[#07080c] bg-[#89CFF0] hover:bg-[#70c4e8] shadow-sm shadow-[#89CFF0]/20"
              >
                înregistrare
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="btn-press md:hidden p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/[0.06]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-[#08090d]/95 backdrop-blur-xl border-b border-white/[0.08] px-6 py-5 space-y-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`nav-link flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm ${
                isActive(link.path)
                  ? 'text-white font-semibold bg-white/[0.06]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {isActive(link.path) && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#89CFF0] shrink-0" />
              )}
              {link.label}
            </Link>
          ))}
          <div className="pt-3 space-y-2">
            {user ? (
              <>
                <div className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-xs font-semibold text-white">{user.name}</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">{user.email}</div>
                </div>
                <Link
                  to="/cont/profil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-press flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <User className="w-3.5 h-3.5" /> Profilul meu
                </Link>
                <Link
                  to="/cont/setari"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-press flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" /> Setări cont
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-press flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-[#89CFF0] bg-[#89CFF0]/10 border border-[#89CFF0]/20"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" /> Admin Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="btn-press flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs text-red-400 hover:bg-red-400/[0.06] transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" /> Deconectare
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-press block w-full py-2.5 text-center rounded-full text-xs font-semibold text-neutral-300 border border-white/10 hover:bg-white/[0.06]"
                >
                  intră în cont
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary-glow block w-full py-2.5 text-center rounded-full text-xs font-semibold text-[#07080c] bg-[#89CFF0] hover:bg-[#70c4e8]"
                >
                  înregistrare
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
