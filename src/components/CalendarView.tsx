'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Room, Booking } from '@/lib/types';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, Plus, Clock, Grid, LayoutGrid, CalendarRange } from 'lucide-react';

interface CalendarViewProps {
  rooms: Room[];
  bookings: Booking[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onSlotClick: (roomId: number, timeStr: string) => void;
}

const HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

export const CalendarView: React.FC<CalendarViewProps> = ({
  rooms,
  bookings,
  selectedDate,
  setSelectedDate,
  onSlotClick
}) => {
  const { lang, t } = useLanguage();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  const handlePrev = () => {
    const curr = new Date(selectedDate);
    if (viewMode === 'day') curr.setDate(curr.getDate() - 1);
    else if (viewMode === 'week') curr.setDate(curr.getDate() - 7);
    else if (viewMode === 'month') curr.setMonth(curr.getMonth() - 1);
    setSelectedDate(curr.toISOString().split('T')[0]);
  };

  const handleNext = () => {
    const curr = new Date(selectedDate);
    if (viewMode === 'day') curr.setDate(curr.getDate() + 1);
    else if (viewMode === 'week') curr.setDate(curr.getDate() + 7);
    else if (viewMode === 'month') curr.setMonth(curr.getMonth() + 1);
    setSelectedDate(curr.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const gridStyle = {
    gridTemplateColumns: `90px repeat(${Math.max(rooms.length, 1)}, minmax(140px, 1fr))`
  };

  // Week View calculation
  const getWeekDays = (dateStr: string) => {
    const curr = new Date(dateStr);
    const dayOfWeek = curr.getDay(); // 0 is Sun
    const sun = new Date(curr);
    sun.setDate(curr.getDate() - dayOfWeek);

    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sun);
      d.setDate(sun.getDate() + i);
      weekDays.push(d);
    }
    return weekDays;
  };

  // Month View calculation
  const getMonthDays = (dateStr: string) => {
    const curr = new Date(dateStr);
    const year = curr.getFullYear();
    const month = curr.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  return (
    <div className="space-y-6">
      
      {/* Date Header & Quick Nav */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-[var(--stroke)] shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[var(--input-bg)] border border-[var(--stroke)] text-[var(--blue)]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text)]">
              {t.calendar.title}
            </h2>
            <p className="text-xs font-mono text-[var(--text-dim)]">
              {new Date(selectedDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* View Mode Switcher + Date Navigation */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Switcher */}
          <div className="flex items-center bg-[var(--input-bg)] p-1 rounded-xl border border-[var(--stroke)]">
            <button
              onClick={() => setViewMode('day')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'day'
                  ? 'bg-[var(--blue)] text-[var(--bg)] shadow-md font-bold'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>{t.calendar.dayView || 'عرض اليوم'}</span>
            </button>

            <button
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'week'
                  ? 'bg-[var(--blue)] text-[var(--bg)] shadow-md font-bold'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>{t.calendar.weekView || 'عرض الأسبوع'}</span>
            </button>

            <button
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'month'
                  ? 'bg-[var(--blue)] text-[var(--bg)] shadow-md font-bold'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              <CalendarRange className="w-3 h-3" />
              <span>{t.calendar.monthView || 'عرض الشهر'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="px-3.5 py-1.5 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--stroke)] border border-[var(--stroke)] text-[var(--blue)] text-xs font-mono font-bold transition-all"
            >
              {t.filter.today}
            </button>
            
            <div className="flex items-center bg-[var(--input-bg)] p-1 rounded-xl border border-[var(--stroke)]">
              <button
                onClick={lang === 'ar' ? handleNext : handlePrev}
                className="p-1 rounded-lg hover:bg-[var(--stroke)] text-[var(--text-dim)] hover:text-[var(--text)] transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs text-[var(--text)] px-2 py-1 focus:outline-none font-mono"
              />

              <button
                onClick={lang === 'ar' ? handlePrev : handleNext}
                className="p-1 rounded-lg hover:bg-[var(--stroke)] text-[var(--text-dim)] hover:text-[var(--text)] transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DAY VIEW (Detailed Hourly Grid) */}
      {viewMode === 'day' && (
        <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-[var(--stroke)] overflow-x-auto shadow-2xl">
          <div className="min-w-[750px]">
            <div className="grid gap-3 pb-4 border-b border-[var(--stroke)]" style={gridStyle}>
              <div className="flex items-center justify-center p-3 rounded-2xl bg-[var(--input-bg)] text-xs font-mono font-bold text-[var(--text-dim)] border border-[var(--stroke)]">
                <Clock className="w-3.5 h-3.5 text-[var(--blue)] mr-1" />
                <span>{t.calendar.timeLabel}</span>
              </div>

              {rooms.map((room) => {
                const name = lang === 'ar' ? room.name_ar : room.name_en;
                const loc = lang === 'ar' ? room.location_ar : room.location_en;

                return (
                  <div
                    key={room.id}
                    className="p-3 rounded-2xl bg-[var(--input-bg)] border border-[var(--stroke)] text-center"
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]"
                        style={{ backgroundColor: room.color, color: room.color }}
                      />
                      <h3 className="font-bold text-xs sm:text-sm text-[var(--text)] truncate">{name}</h3>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[var(--text-dim)]">
                      <span>{loc}</span>
                      <span>•</span>
                      <span>{room.capacity} {lang === 'ar' ? 'فرد' : 'pax'}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="divide-y divide-[var(--stroke)]">
              {HOURS.map((hour) => (
                <div key={hour} className="grid gap-3 py-2 items-stretch min-h-[75px]" style={gridStyle}>
                  <div className="flex items-center justify-center font-mono text-xs font-bold text-[var(--text-dim)] bg-[var(--input-bg)] rounded-xl border border-[var(--stroke)]">
                    {hour}
                  </div>

                  {rooms.map((room) => {
                    const roomBookings = bookings.filter(b => b.room_id === room.id && b.status !== 'cancelled' && b.booking_date?.substring(0, 10) === selectedDate);
                    const activeBooking = roomBookings.find(b => {
                      const bStart = b.start_time.substring(0, 5);
                      const bEnd = b.end_time.substring(0, 5);
                      return hour >= bStart && hour < bEnd;
                    });

                    if (activeBooking) {
                      return (
                        <div
                          key={room.id}
                          className="p-2.5 rounded-xl border text-xs relative overflow-hidden transition-all shadow-lg"
                          style={{
                            backgroundColor: `${room.color}18`,
                            borderColor: `${room.color}40`,
                          }}
                        >
                          <div
                            className="absolute right-0 top-0 bottom-0 w-1 shadow-[0_0_10px_currentColor]"
                            style={{ backgroundColor: room.color, color: room.color }}
                          />
                          <div className="flex items-center justify-between font-bold text-[var(--text)] mb-1">
                            <span className="truncate">{activeBooking.event_title}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg)] text-[var(--blue)] font-mono border border-[var(--stroke)]">
                              {activeBooking.start_time.substring(0, 5)} - {activeBooking.end_time.substring(0, 5)}
                            </span>
                          </div>
                          <div className="text-[11px] text-[var(--text-dim)]">
                            👤 {activeBooking.booker_name}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={room.id}
                        onClick={() => onSlotClick(room.id, hour)}
                        className="group flex flex-col items-center justify-center p-2 rounded-xl border border-dashed border-[var(--stroke)] hover:border-[var(--blue)] bg-[var(--input-bg)] text-[var(--text-faint)] hover:text-[var(--blue)] transition-all text-xs"
                      >
                        <Plus className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                        <span className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-all font-mono font-bold">
                          {t.calendar.freeSlot}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WEEK VIEW (7-Day Overview Grid) */}
      {viewMode === 'week' && (
        <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-[var(--stroke)] overflow-x-auto shadow-2xl">
          <div className="grid grid-cols-7 gap-3 min-w-[800px]">
            {getWeekDays(selectedDate).map((dayDate) => {
              const dayStr = dayDate.toISOString().split('T')[0];
              const dayBookings = bookings.filter(b => b.booking_date?.substring(0, 10) === dayStr && b.status !== 'cancelled');
              const isSelected = dayStr === selectedDate;

              return (
                <div
                  key={dayStr}
                  onClick={() => { setSelectedDate(dayStr); setViewMode('day'); }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[rgba(99,102,241,0.15)] border-[var(--blue)] shadow-lg'
                      : 'bg-[var(--input-bg)] border-[var(--stroke)] hover:border-[var(--blue)]'
                  }`}
                >
                  <div className="text-center pb-2 border-b border-[var(--stroke)] mb-2">
                    <p className="text-[11px] font-bold text-[var(--text-dim)] font-mono">
                      {dayDate.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-sm font-bold text-[var(--text)] font-mono">
                      {dayDate.getDate()}
                    </p>
                  </div>

                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {dayBookings.length === 0 ? (
                      <p className="text-[10px] text-[var(--text-dim)] text-center py-4">{t.calendar.freeSlot}</p>
                    ) : (
                      dayBookings.map((b) => (
                        <div
                          key={b.id}
                          className="p-1.5 rounded-lg bg-[var(--bg)] border border-[var(--stroke)] text-[10px] text-[var(--text)] font-sans truncate"
                        >
                          <div className="font-bold truncate text-[var(--blue)]">{b.event_title}</div>
                          <div className="text-[9px] text-[var(--text-dim)] font-mono">
                            {b.start_time.substring(0, 5)} - {b.end_time.substring(0, 5)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MONTH VIEW (Monthly Density Calendar) */}
      {viewMode === 'month' && (
        <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-[var(--stroke)] shadow-2xl">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[var(--text-dim)] mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="p-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {getMonthDays(selectedDate).map((dayDate, idx) => {
              if (!dayDate) {
                return <div key={`empty-${idx}`} className="p-4 rounded-xl bg-[var(--input-bg)]/30 border border-transparent"></div>;
              }

              const dayStr = dayDate.toISOString().split('T')[0];
              const dayBookings = bookings.filter(b => b.booking_date?.substring(0, 10) === dayStr && b.status !== 'cancelled');
              const isToday = dayStr === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={dayStr}
                  onClick={() => { setSelectedDate(dayStr); setViewMode('day'); }}
                  className={`p-2 sm:p-3 rounded-2xl border transition-all cursor-pointer min-h-[80px] flex flex-col justify-between ${
                    isToday
                      ? 'bg-[rgba(99,102,241,0.2)] border-[var(--blue)]'
                      : 'bg-[var(--input-bg)] border-[var(--stroke)] hover:border-[var(--blue)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-[var(--text)]">{dayDate.getDate()}</span>
                    {dayBookings.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[var(--blue)] text-[var(--bg)]">
                        {dayBookings.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1">
                    {dayBookings.slice(0, 2).map((b) => (
                      <div key={b.id} className="text-[9px] truncate px-1 rounded bg-[var(--bg)] text-[var(--text-dim)]">
                        • {b.event_title}
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="text-[8px] text-[var(--blue)] font-bold text-center">
                        +{dayBookings.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
