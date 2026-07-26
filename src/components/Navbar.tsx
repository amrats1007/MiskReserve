'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, BookOpen, Building2, Plus, Printer, Globe, Sparkles } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-indigo-500/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('calendar')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-2 ring-white/20">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
                  {t.appName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold tracking-wider uppercase">
                  MiskTech
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.appSubTitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-700/50">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'calendar'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {t.nav.calendar}
            </button>

            <button
              onClick={() => setActiveTab('logbook')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'logbook'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {t.nav.logbook}
            </button>

            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'rooms'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
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
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs font-semibold transition-all"
              title={t.nav.printLogbook}
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>{t.nav.printLogbook}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold transition-all"
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* New Reservation Trigger */}
            <button
              onClick={onOpenBookingModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>{t.nav.newBooking}</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around py-3 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg ${
              activeTab === 'calendar' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {t.nav.calendar}
          </button>
          <button
            onClick={() => setActiveTab('logbook')}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg ${
              activeTab === 'logbook' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {t.nav.logbook}
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg ${
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
