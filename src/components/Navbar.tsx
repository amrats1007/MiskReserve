'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Calendar, BookOpen, Building2, Plus, Globe, LogOut, ShieldCheck, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeTab: 'calendar' | 'logbook' | 'rooms' | 'users';
  setActiveTab: (tab: 'calendar' | 'logbook' | 'rooms' | 'users') => void;
  onOpenBookingModal: () => void;
  onPrintLogbook: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBookingModal,
}) => {
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isApproved = user && user.status === 'approved';

  return (
    <header className="sticky top-3.5 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-panel border border-[var(--stroke)] rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl backdrop-blur-2xl">
        
        {/* Logo & Branding */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => isApproved && setActiveTab('calendar')}
        >
          <div className="w-8 h-8 rounded-lg bg-[var(--text)] text-[var(--bg)] font-mono font-bold text-xs flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
            MR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-[var(--text)] font-display">
                {t.appName}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--input-bg)] border border-[var(--stroke)] font-mono text-[10px] text-[var(--text-dim)] tracking-widest uppercase">
                <span className="dot-live"></span>
                MiskTech
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - ONLY VISIBLE WHEN LOGGED IN AND APPROVED */}
        {isApproved && (
          <nav className="hidden md:flex items-center gap-1.5 bg-[var(--input-bg)] p-1.5 rounded-xl border border-[var(--stroke)]">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                activeTab === 'calendar'
                  ? 'bg-gradient-to-r from-[var(--blue)] via-[var(--violet)] to-[var(--cyan)] text-[var(--bg)] font-bold shadow-lg'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--stroke)]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {t.nav.calendar}
            </button>

            <button
              onClick={() => setActiveTab('logbook')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                activeTab === 'logbook'
                  ? 'bg-gradient-to-r from-[var(--blue)] via-[var(--violet)] to-[var(--cyan)] text-[var(--bg)] font-bold shadow-lg'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--stroke)]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {t.nav.logbook}
            </button>

            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                activeTab === 'rooms'
                  ? 'bg-gradient-to-r from-[var(--blue)] via-[var(--violet)] to-[var(--cyan)] text-[var(--bg)] font-bold shadow-lg'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--stroke)]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              {t.nav.rooms}
            </button>

            {/* Admin Users Approval Tab */}
            {user.role === 'admin' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-[var(--blue)] via-[var(--violet)] to-[var(--cyan)] text-[var(--bg)] font-bold shadow-lg'
                    : 'text-[var(--cyan)] bg-[rgba(103,232,249,0.08)] hover:bg-[rgba(103,232,249,0.15)] border border-[rgba(103,232,249,0.3)]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--cyan)]" />
                <span>{t.nav.users}</span>
              </button>
            )}
          </nav>
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* User Profile Badge (when logged in) */}
          {user && (
            <div className="flex items-center gap-2.5 bg-[var(--input-bg)] border border-[var(--stroke)] px-3 py-1.5 rounded-xl">
              <div className="flex flex-col text-right ltr:text-left">
                <span className="text-xs font-bold text-[var(--text)] truncate max-w-[110px]">{user.name}</span>
                <span className="text-[10px] text-[var(--blue)] font-mono">{user.entity_name}</span>
              </div>
              <button
                onClick={logout}
                className="p-1 rounded-lg hover:bg-[rgba(244,63,94,0.15)] text-[var(--text-dim)] hover:text-[#F43F5E] transition-all"
                title={t.nav.logout}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Light/Dark Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--stroke)] border border-[var(--stroke)] text-[var(--text)] transition-all flex items-center justify-center"
            title={
              theme === 'dark'
                ? (lang === 'ar' ? 'الانتقال إلى الثيم الفاتح' : 'Switch to Light Mode')
                : (lang === 'ar' ? 'الانتقال إلى الثيم الداكن' : 'Switch to Dark Mode')
            }
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F59E0B] hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-[#7C3AED] hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--stroke)] border border-[var(--stroke)] text-[var(--text)] text-xs font-mono font-medium transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-[var(--blue)]" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* New Reservation Trigger - ONLY VISIBLE WHEN LOGGED IN AND APPROVED */}
          {isApproved && (
            <button
              onClick={onOpenBookingModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--text)] hover:opacity-90 text-[var(--bg)] text-xs font-bold shadow-lg hover:scale-[1.03] active:scale-[0.97] transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">{t.nav.newBooking}</span>
            </button>
          )}
        </div>

      </div>

      {/* Mobile Navigation Tabs - ONLY VISIBLE WHEN LOGGED IN AND APPROVED */}
      {isApproved && (
        <div className="flex md:hidden items-center justify-around mt-2 p-2 rounded-xl glass-panel border border-[var(--stroke)]">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
              activeTab === 'calendar' ? 'bg-[var(--blue)] text-[var(--bg)]' : 'text-[var(--text-dim)]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {t.nav.calendar}
          </button>
          <button
            onClick={() => setActiveTab('logbook')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
              activeTab === 'logbook' ? 'bg-[var(--blue)] text-[var(--bg)]' : 'text-[var(--text-dim)]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {t.nav.logbook}
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
              activeTab === 'rooms' ? 'bg-[var(--blue)] text-[var(--bg)]' : 'text-[var(--text-dim)]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            {t.nav.rooms}
          </button>
          {user && user.role === 'admin' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
                activeTab === 'users' ? 'bg-[var(--blue)] text-[var(--bg)]' : 'text-[var(--cyan)]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.nav.users}
            </button>
          )}
        </div>
      )}
    </header>
  );
};
