import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
}

export interface UpdateAccountData {
  name: string;
  email: string;
  phone: string;
  current_password?: string;
  new_password?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (email: string, password: string, name: string, birthdate: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateAccount: (data: UpdateAccountData) => Promise<{ ok: boolean; error?: string }>;
  adminHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        return { ok: true };
      }
      return { ok: false, error: data.error ?? 'Eroare la autentificare.' };
    } catch (err) {
      console.error('[auth] login failed:', err);
      return { ok: false, error: 'Serverul PHP nu este accesibil. Verifică că rulează și că VITE_API_URL din .env este corect.' };
    }
  };

  const register = async (email: string, password: string, name: string, birthdate: string) => {
    try {
      const res = await fetch(`${API_BASE}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, birthdate }),
      });
      const data = await res.json();
      if (data.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        return { ok: true };
      }
      return { ok: false, error: data.error ?? 'Eroare la înregistrare.' };
    } catch (err) {
      console.error('[auth] register failed:', err);
      return { ok: false, error: 'Serverul PHP nu este accesibil. Verifică că rulează și că VITE_API_URL din .env este corect.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const updateAccount = async (data: UpdateAccountData) => {
    if (!user) return { ok: false, error: 'Nu ești autentificat.' };
    try {
      const res = await fetch(`${API_BASE}/account.php`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': String(user.id),
        },
        body: JSON.stringify({ id: user.id, ...data }),
      });
      const json = await res.json();
      if (json.ok && json.user) {
        const updated: AuthUser = {
          ...user,
          name:  json.user.name  ?? user.name,
          email: json.user.email ?? user.email,
          phone: json.user.phone ?? data.phone,
          role:  json.user.role  ?? user.role,
        };
        setUser(updated);
        localStorage.setItem('auth_user', JSON.stringify(updated));
        return { ok: true };
      }
      return { ok: false, error: json.error ?? 'Eroare la actualizare.' };
    } catch (err) {
      console.error('[auth] updateAccount failed:', err);
      return { ok: false, error: 'Serverul PHP nu este accesibil.' };
    }
  };

  const adminHeaders = () => ({
    'Content-Type': 'application/json',
    'X-User-Id': String(user?.id ?? ''),
    'X-User-Role': user?.role ?? '',
  });

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      updateAccount,
      adminHeaders,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
