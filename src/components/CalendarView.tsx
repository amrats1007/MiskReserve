'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Room, Booking } from '@/lib/types';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, Plus, Clock } from 'lucide-react';

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

  const handlePrevDay = () => {
    const curr = new Date(selectedDate);
    curr.setDate(curr.getDate() - 1);
    setSelectedDate(curr.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const curr = new Date(selectedDate);
    curr.setDate(curr.getDate() + 1);
    setSelectedDate(curr.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  // Dynamic grid template columns based on number of rooms
  const gridStyle = {
    gridTemplateColumns: `90px repeat(${Math.max(rooms.length, 1)}, minmax(140px, 1fr))`
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

        {/* Date Selector controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3.5 py-1.5 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--stroke)] border border-[var(--stroke)] text-[var(--blue)] text-xs font-mono font-bold transition-all"
          >
            {t.filter.today}
          </button>
          
          <div className="flex items-center bg-[var(--input-bg)] p-1 rounded-xl border border-[var(--stroke)]">
            <button
              onClick={lang === 'ar' ? handleNextDay : handlePrevDay}
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
              onClick={lang === 'ar' ? handlePrevDay : handleNextDay}
              className="p-1 rounded-lg hover:bg-[var(--stroke)] text-[var(--text-dim)] hover:text-[var(--text)] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Timeline View */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-[var(--stroke)] overflow-x-auto shadow-2xl">
        <div className="min-w-[750px]">
          
          {/* Header Row: Room Columns (Dynamic Grid) */}
          <div className="grid gap-3 pb-4 border-b border-[var(--stroke)]" style={gridStyle}>
            {/* Time Column Header */}
            <div className="flex items-center justify-center p-3 rounded-2xl bg-[var(--input-bg)] text-xs font-mono font-bold text-[var(--text-dim)] border border-[var(--stroke)]">
              <Clock className="w-3.5 h-3.5 text-[var(--blue)] mr-1" />
              <span>{t.calendar.timeLabel}</span>
            </div>

            {/* Room Column Headers */}
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

          {/* Time Rows */}
          <div className="divide-y divide-[var(--stroke)]">
            {HOURS.map((hour) => (
              <div key={hour} className="grid gap-3 py-2 items-stretch min-h-[75px]" style={gridStyle}>
                
                {/* Hour Label */}
                <div className="flex items-center justify-center font-mono text-xs font-bold text-[var(--text-dim)] bg-[var(--input-bg)] rounded-xl border border-[var(--stroke)]">
                  {hour}
                </div>

                {/* Rooms Grid for this Hour */}
                {rooms.map((room) => {
                  const roomBookings = bookings.filter(b => b.room_id === room.id && b.status !== 'cancelled');
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
                        <div className="text-[10px] text-[var(--text-faint)]">
                          🏢 {activeBooking.entity_name}
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

    </div>
  );
};
