'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Calendar, BookOpen, Building2, Plus, Globe, LogOut, ShieldCheck } from 'lucide-react';

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

  const isApproved = user && user.status === 'approved';

  return (
    <header className="sticky top-3.5 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-panel border border-[var(--stroke)] rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl backdrop-blur-2xl bg-[#0a0b0f8c]">
        
        {/* Logo & Branding */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => isApproved && setActiveTab('calendar')}
        >
          <div className="w-8 h-8 rounded-lg bg-[#F4F5F7] text-[#07080B] font-mono font-bold text-xs flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
            MR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-display">
                {t.appName}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.05)] border border-[var(--stroke)] font-mono text-[10px] text-[#A2A7B3] tracking-widest uppercase">
                <span className="dot-live"></span>
                MiskTech
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - ONLY VISIBLE WHEN LOGGED IN AND APPROVED */}
        {isApproved && (
          <nav className="hidden md:flex items-center gap-1.5 bg-[rgba(255,255,255,0.03)] p-1.5 rounded-xl border border-[var(--stroke)]">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                activeTab === 'calendar'
                  ? 'bg-gradient-to-r from-[#7DA9FF] via-[#A78BFA] to-[#67E8F9] text-[#07080B] font-bold shadow-[0_0_20px_rgba(125,169,255,0.35)]'
                  : 'text-[#A2A7B3] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {t.nav.calendar}
            </button>

            <button
              onClick={() => setActiveTab('logbook')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                activeTab === 'logbook'
                  ? 'bg-gradient-to-r from-[#7DA9FF] via-[#A78BFA] to-[#67E8F9] text-[#07080B] font-bold shadow-[0_0_20px_rgba(125,169,255,0.35)]'
                  : 'text-[#A2A7B3] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {t.nav.logbook}
            </button>

            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                activeTab === 'rooms'
                  ? 'bg-gradient-to-r from-[#7DA9FF] via-[#A78BFA] to-[#67E8F9] text-[#07080B] font-bold shadow-[0_0_20px_rgba(125,169,255,0.35)]'
                  : 'text-[#A2A7B3] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
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
                    ? 'bg-gradient-to-r from-[#7DA9FF] via-[#A78BFA] to-[#67E8F9] text-[#07080B] font-bold shadow-[0_0_20px_rgba(125,169,255,0.35)]'
                    : 'text-[#67E8F9] bg-[rgba(103,232,249,0.08)] hover:bg-[rgba(103,232,249,0.15)] border border-[rgba(103,232,249,0.3)]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#67E8F9]" />
                <span>إدارة الحسابات</span>
              </button>
            )}
          </nav>
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* User Profile Badge (when logged in) */}
          {user && (
            <div className="flex items-center gap-2.5 bg-[rgba(255,255,255,0.04)] border border-[var(--stroke)] px-3 py-1.5 rounded-xl">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-white truncate max-w-[110px]">{user.name}</span>
                <span className="text-[10px] text-[#7DA9FF] font-mono">{user.entity_name}</span>
              </div>
              <button
                onClick={logout}
                className="p-1 rounded-lg hover:bg-[rgba(244,63,94,0.15)] text-[#A2A7B3] hover:text-[#F43F5E] transition-all"
                title="تسجيل الخروج"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[var(--stroke)] text-white text-xs font-mono font-medium transition-all hover:border-[rgba(125,169,255,0.4)]"
          >
            <Globe className="w-3.5 h-3.5 text-[#7DA9FF]" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* New Reservation Trigger - ONLY VISIBLE WHEN LOGGED IN AND APPROVED */}
          {isApproved && (
            <button
              onClick={onOpenBookingModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F4F5F7] hover:bg-white text-[#07080B] text-xs font-bold shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(125,169,255,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all"
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
              activeTab === 'calendar' ? 'bg-[#7DA9FF] text-[#07080B]' : 'text-[#A2A7B3]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {t.nav.calendar}
          </button>
          <button
            onClick={() => setActiveTab('logbook')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
              activeTab === 'logbook' ? 'bg-[#7DA9FF] text-[#07080B]' : 'text-[#A2A7B3]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {t.nav.logbook}
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
              activeTab === 'rooms' ? 'bg-[#7DA9FF] text-[#07080B]' : 'text-[#A2A7B3]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            {t.nav.rooms}
          </button>
          {user && user.role === 'admin' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
                activeTab === 'users' ? 'bg-[#7DA9FF] text-[#07080B]' : 'text-[#67E8F9]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              الحسابات
            </button>
          )}
        </div>
      )}
    </header>
  );
};
