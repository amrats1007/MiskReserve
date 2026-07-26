'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Calendar, BookOpen, Building2, Plus, Printer, Globe, LogIn, LogOut, UserCheck, ShieldCheck, User } from 'lucide-react';

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
  onPrintLogbook
}) => {
  const { lang, setLang, t } = useLanguage();
  const { user, openAuthModal, logout } = useAuth();

  const isApproved = user && user.status === 'approved';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3.5 cursor-pointer group" onClick={() => isApproved && setActiveTab('calendar')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black gradient-text tracking-tight">
                  {t.appName}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold uppercase tracking-wider">
                  MiskTech
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {t.appSubTitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs - ONLY VISIBLE WHEN LOGGED IN AND APPROVED */}
          {isApproved && (
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  activeTab === 'calendar'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60'
                }`}
              >
                <Calendar className="w-4 h-4" />
                {t.nav.calendar}
              </button>

              <button
                onClick={() => setActiveTab('logbook')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  activeTab === 'logbook'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                {t.nav.logbook}
              </button>

              <button
                onClick={() => setActiveTab('rooms')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  activeTab === 'rooms'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60'
                }`}
              >
                <Building2 className="w-4 h-4" />
                {t.nav.rooms}
              </button>

              {/* Admin Users Approval Tab */}
              {user.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeTab === 'users'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>إدارة الحسابات</span>
                </button>
              )}
            </nav>
          )}

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* User Profile Badge (when logged in) */}
            {user && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 pr-3 rounded-2xl">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{user.name}</span>
                  <span className="text-[10px] text-indigo-600 font-semibold">{user.entity_name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all hover:border-indigo-300 hover:text-indigo-600 shadow-xs"
            >
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* New Reservation Trigger - ONLY VISIBLE WHEN LOGGED IN AND APPROVED */}
            {isApproved && (
              <button
                onClick={onOpenBookingModal}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white text-xs font-extrabold shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.03] active:scale-[0.97] transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">{t.nav.newBooking}</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation Tabs - ONLY VISIBLE WHEN LOGGED IN AND APPROVED */}
        {isApproved && (
          <div className="flex md:hidden items-center justify-around py-3 border-t border-slate-200">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
                activeTab === 'calendar' ? 'bg-indigo-600 text-white' : 'text-slate-600'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {t.nav.calendar}
            </button>
            <button
              onClick={() => setActiveTab('logbook')}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
                activeTab === 'logbook' ? 'bg-indigo-600 text-white' : 'text-slate-600'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {t.nav.logbook}
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
                activeTab === 'rooms' ? 'bg-indigo-600 text-white' : 'text-slate-600'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              {t.nav.rooms}
            </button>
            {user && user.role === 'admin' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
                  activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-amber-700'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                الحسابات
              </button>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
