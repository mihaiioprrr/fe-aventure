import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';
import { HomePage } from './pages/HomePage';
import { OffersPage } from './pages/OffersPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPage } from './pages/admin/AdminPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { BookingPage } from './pages/BookingPage';
import { AuthProvider } from './context/AuthContext';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[#07080c] text-white font-sans">
    {children}
  </div>
);

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-[#07080c] text-white font-sans selection:bg-[#89CFF0]/30 selection:text-white">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <ChatWidget />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/cont/setari" element={<MainLayout><AccountSettingsPage /></MainLayout>} />
          <Route path="/cont/profil" element={<MainLayout><ProfilePage /></MainLayout>} />
          <Route path="/rezervare" element={<MainLayout><BookingPage /></MainLayout>} />
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/oferte" element={<MainLayout><OffersPage /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
          <Route path="*" element={<MainLayout><HomePage /></MainLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
