'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, CheckCircle2, Building, TrendingUp, Sparkles } from 'lucide-react';

interface StatsOverviewProps {
  stats: {
    totalBookings: number;
    todayBookings: number;
    totalRooms: number;
    busiestRoom: { name_ar: string; name_en: string; booking_count: number } | null;
    topEntity: { entity_name: string; booking_count: number } | null;
  } | null;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const { lang, t } = useLanguage();

  if (!stats) return null;

  const busiestRoomName = stats.busiestRoom
    ? (lang === 'ar' ? stats.busiestRoom.name_ar : stats.busiestRoom.name_en)
    : '-';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Total Bookings */}
      <div className="glass-panel glass-panel-hover p-5 rounded-3xl border border-indigo-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.stats.totalBookings}</span>
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-3xl font-black text-white font-mono">{stats.totalBookings}</span>
          <span className="text-xs text-indigo-300 mr-2 font-medium">حجز مسجل بالكامل</span>
        </div>
      </div>

      {/* Bookings Today */}
      <div className="glass-panel glass-panel-hover p-5 rounded-3xl border border-emerald-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.stats.activeToday}</span>
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-3xl font-black text-white font-mono">{stats.todayBookings}</span>
          <span className="text-xs text-emerald-300 mr-2 font-medium">فعالية نشطة اليوم</span>
        </div>
      </div>

      {/* Busiest Room */}
      <div className="glass-panel glass-panel-hover p-5 rounded-3xl border border-purple-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.stats.busiestRoom}</span>
          <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400">
            <Building className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-base font-extrabold text-white truncate block">{busiestRoomName}</span>
          <span className="text-xs text-purple-300 font-medium">
            {stats.busiestRoom ? `${stats.busiestRoom.booking_count} حجز` : ''}
          </span>
        </div>
      </div>

      {/* Top Requesting Entity */}
      <div className="glass-panel glass-panel-hover p-5 rounded-3xl border border-pink-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.stats.topEntity}</span>
          <div className="p-2.5 rounded-2xl bg-pink-500/20 text-pink-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-base font-extrabold text-white truncate block">
            {stats.topEntity ? stats.topEntity.entity_name : '-'}
          </span>
          <span className="text-xs text-pink-300 font-medium">الأكثر استخداماً للقاعات</span>
        </div>
      </div>

    </div>
  );
};
