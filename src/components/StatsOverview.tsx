'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, CheckCircle2, Building, TrendingUp } from 'lucide-react';

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
      <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-[var(--stroke)] relative overflow-hidden group shadow-xl">
        <div className="flex items-center justify-between relative z-10">
          <span className="font-mono text-[11px] font-semibold text-[#A2A7B3] uppercase tracking-wider">{t.stats.totalBookings}</span>
          <div className="p-2.5 rounded-xl bg-[rgba(125,169,255,0.1)] text-[#7DA9FF] border border-[rgba(125,169,255,0.3)]">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 relative z-10 flex items-baseline justify-between">
          <span className="text-3xl font-bold text-white font-mono tracking-tight">{stats.totalBookings}</span>
          <span className="text-[11px] text-[#7DA9FF] font-mono">سجل الكتروني</span>
        </div>
      </div>

      {/* Bookings Today */}
      <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-[var(--stroke)] relative overflow-hidden group shadow-xl">
        <div className="flex items-center justify-between relative z-10">
          <span className="font-mono text-[11px] font-semibold text-[#A2A7B3] uppercase tracking-wider">{t.stats.activeToday}</span>
          <div className="p-2.5 rounded-xl bg-[rgba(74,222,128,0.1)] text-[#4ADE80] border border-[rgba(74,222,128,0.3)]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 relative z-10 flex items-baseline justify-between">
          <span className="text-3xl font-bold text-[#4ADE80] font-mono tracking-tight">{stats.todayBookings}</span>
          <span className="text-[11px] text-[#4ADE80] font-mono">● نشطة اليوم</span>
        </div>
      </div>

      {/* Busiest Room */}
      <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-[var(--stroke)] relative overflow-hidden group shadow-xl">
        <div className="flex items-center justify-between relative z-10">
          <span className="font-mono text-[11px] font-semibold text-[#A2A7B3] uppercase tracking-wider">{t.stats.busiestRoom}</span>
          <div className="p-2.5 rounded-xl bg-[rgba(167,139,250,0.1)] text-[#A78BFA] border border-[rgba(167,139,250,0.3)]">
            <Building className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 relative z-10">
          <span className="text-base font-bold text-white truncate block">{busiestRoomName}</span>
          <span className="text-[11px] text-[#A78BFA] font-mono">
            {stats.busiestRoom ? `${stats.busiestRoom.booking_count} حجز` : '-'}
          </span>
        </div>
      </div>

      {/* Top Requesting Entity */}
      <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-[var(--stroke)] relative overflow-hidden group shadow-xl">
        <div className="flex items-center justify-between relative z-10">
          <span className="font-mono text-[11px] font-semibold text-[#A2A7B3] uppercase tracking-wider">{t.stats.topEntity}</span>
          <div className="p-2.5 rounded-xl bg-[rgba(103,232,249,0.1)] text-[#67E8F9] border border-[rgba(103,232,249,0.3)]">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 relative z-10">
          <span className="text-base font-bold text-white truncate block">
            {stats.topEntity ? stats.topEntity.entity_name : '-'}
          </span>
          <span className="text-[11px] text-[#67E8F9] font-mono">الأكثر حجزاً</span>
        </div>
      </div>

    </div>
  );
};
