'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, Plus, Users, MapPin, Clock, Tag } from 'lucide-react';

interface Room {
  id: number;
  name_ar: string;
  name_en: string;
  code: string;
  capacity: number;
  location_ar: string;
  location_en: string;
  color: string;
}

interface Booking {
  id: number;
  room_id: number;
  booker_name: string;
  entity_name: string;
  event_title: string;
  event_type: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  attendees_count: number;
  status: string;
}

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

  return (
    <div className="space-y-6">
      
      {/* Date Header & Quick Nav */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {t.calendar.title}
            </h2>
            <p className="text-xs text-slate-400">
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
            className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all"
          >
            {t.filter.today}
          </button>
          
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={lang === 'ar' ? handleNextDay : handlePrevDay}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-white px-2 py-1 focus:outline-none font-mono"
            />

            <button
              onClick={lang === 'ar' ? handlePrevDay : handleNextDay}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Timeline View */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-slate-700/60 overflow-x-auto">
        <div className="min-w-[700px]">
          
          {/* Header Row: Room Columns */}
          <div className="grid grid-cols-5 gap-3 pb-4 border-b border-slate-700/60">
            {/* Time Column Header */}
            <div className="flex items-center justify-center p-3 rounded-2xl bg-slate-900/60 text-xs font-bold text-slate-400">
              <Clock className="w-4 h-4 text-indigo-400 mr-1" />
              <span>الساعة / Time</span>
            </div>

            {/* Room Column Headers */}
            {rooms.map((room) => {
              const name = lang === 'ar' ? room.name_ar : room.name_en;
              const loc = lang === 'ar' ? room.location_ar : room.location_en;

              return (
                <div
                  key={room.id}
                  className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/40 text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: room.color }}
                    />
                    <h3 className="font-bold text-xs sm:text-sm text-white truncate">{name}</h3>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                    <span>{loc}</span>
                    <span>•</span>
                    <span>{room.capacity} {lang === 'ar' ? 'فرد' : 'pax'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Rows */}
          <div className="divide-y divide-slate-800/60">
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-5 gap-3 py-2 items-stretch min-h-[75px]">
                
                {/* Hour Label */}
                <div className="flex items-center justify-center font-mono text-xs font-bold text-slate-400 bg-slate-900/30 rounded-xl">
                  {hour}
                </div>

                {/* Rooms Grid for this Hour */}
                {rooms.map((room) => {
                  // Find booking for this room & hour
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
                        className="p-2.5 rounded-xl border text-xs relative overflow-hidden transition-all shadow-md"
                        style={{
                          backgroundColor: `${room.color}20`,
                          borderColor: `${room.color}60`,
                        }}
                      >
                        <div
                          className="absolute right-0 top-0 bottom-0 w-1"
                          style={{ backgroundColor: room.color }}
                        />
                        <div className="flex items-center justify-between font-bold text-white mb-1">
                          <span className="truncate">{activeBooking.event_title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900/80 text-indigo-300 font-mono">
                            {activeBooking.start_time.substring(0, 5)} - {activeBooking.end_time.substring(0, 5)}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300 font-medium">
                          👤 {activeBooking.booker_name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          🏢 {activeBooking.entity_name}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={room.id}
                      onClick={() => onSlotClick(room.id, hour)}
                      className="group flex flex-col items-center justify-center p-2 rounded-xl border border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/20 hover:bg-indigo-950/20 text-slate-600 hover:text-indigo-400 transition-all text-xs"
                    >
                      <Plus className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      <span className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-all font-semibold">
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
