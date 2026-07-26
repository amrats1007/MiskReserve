'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, BookOpen, Building2, Plus, Printer, Globe, Sparkles, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: 'calendar' | 'logbook' | 'rooms';
  setActiveTab: (tab: 'calendar' | 'logbook' | 'rooms') => void;
  onOpenBookingModal: () => void;
  onPrintLogbook: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBookingModal,
  onPrintLogbook
}) => {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3.5 cursor-pointer group" onClick={() => setActiveTab('calendar')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/30 group-hover:scale-105 transition-transform duration-300">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black gradient-text tracking-tight">
                  {t.appName}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold uppercase tracking-wider">
                  MiskTech
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                {t.appSubTitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/70 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeTab === 'calendar'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {t.nav.calendar}
            </button>

            <button
              onClick={() => setActiveTab('logbook')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeTab === 'logbook'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {t.nav.logbook}
            </button>

            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeTab === 'rooms'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-4 h-4" />
              {t.nav.rooms}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Print Logbook */}
            <button
              onClick={onPrintLogbook}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-xs font-semibold transition-all hover:text-white"
              title={t.nav.printLogbook}
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>{t.nav.printLogbook}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-bold transition-all hover:border-indigo-500/50"
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* New Reservation Trigger */}
            <button
              onClick={onOpenBookingModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 text-white text-xs font-extrabold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.03] active:scale-[0.97] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t.nav.newBooking}</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around py-3 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
              activeTab === 'calendar' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {t.nav.calendar}
          </button>
          <button
            onClick={() => setActiveTab('logbook')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
              activeTab === 'logbook' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {t.nav.logbook}
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
              activeTab === 'rooms' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            {t.nav.rooms}
          </button>
        </div>

      </div>
    </header>
  );
};
