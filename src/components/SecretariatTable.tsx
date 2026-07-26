'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Filter, CheckCircle, XCircle, Trash2, Printer, Calendar, Clock, User, Building, FileText, Check, AlertCircle } from 'lucide-react';

interface Booking {
  id: number;
  room_id: number;
  room_name_ar?: string;
  room_name_en?: string;
  room_color?: string;
  booker_name: string;
  entity_name: string;
  event_title: string;
  event_type: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  attendees_count: number;
  requested_equipment?: string[];
  notes?: string;
  status: string;
}

interface SecretariatTableProps {
  bookings: Booking[];
  onStatusChange: (id: number, status: string) => void;
  onDeleteBooking: (id: number) => void;
  onPrint: () => void;
}

export const SecretariatTable: React.FC<SecretariatTableProps> = ({
  bookings,
  onStatusChange,
  onDeleteBooking,
  onPrint
}) => {
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      (b.booker_name && b.booker_name.toLowerCase().includes(q)) ||
      (b.entity_name && b.entity_name.toLowerCase().includes(q)) ||
      (b.event_title && b.event_title.toLowerCase().includes(q)) ||
      (b.room_name_ar && b.room_name_ar.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            {t.logbook.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t.logbook.subtitle}</p>
        </div>

        {/* Search & Filter Inputs */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.filter.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs bg-white text-slate-900 border-slate-300"
          >
            <option value="all">{t.filter.allStatuses}</option>
            <option value="confirmed">{t.filter.confirmed}</option>
            <option value="pending">{t.filter.pending}</option>
            <option value="cancelled">{t.filter.cancelled}</option>
          </select>

          {/* Print Button */}
          <button
            onClick={onPrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-all hover:border-indigo-300 hover:text-indigo-600 shadow-xs"
          >
            <Printer className="w-4 h-4 text-indigo-600" />
            <span>{t.nav.printLogbook}</span>
          </button>
        </div>
      </div>

      {/* Logbook Table Card */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200 overflow-hidden shadow-sm">
        
        {/* Printable Header Title */}
        <div className="hidden print-only text-center mb-6">
          <h1 className="text-2xl font-bold text-black">{t.logbook.printTitle}</h1>
          <p className="text-sm text-gray-600">تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">{t.logbook.tableHeader.id}</th>
                <th className="p-3">{t.logbook.tableHeader.date}</th>
                <th className="p-3">{t.logbook.tableHeader.time}</th>
                <th className="p-3">{t.logbook.tableHeader.room}</th>
                <th className="p-3">{t.logbook.tableHeader.booker}</th>
                <th className="p-3">{t.logbook.tableHeader.entity}</th>
                <th className="p-3">{t.logbook.tableHeader.eventTitle}</th>
                <th className="p-3 text-center">{t.logbook.tableHeader.attendees}</th>
                <th className="p-3">{t.logbook.tableHeader.status}</th>
                <th className="p-3 text-center no-print">{t.logbook.tableHeader.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    {t.logbook.noData}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b, idx) => {
                  const roomName = lang === 'ar' ? b.room_name_ar : b.room_name_en;

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/90 transition-colors">
                      <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-3 whitespace-nowrap font-mono text-indigo-700 font-semibold">
                        {new Date(b.booking_date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono text-slate-700">
                        {b.start_time.substring(0, 5)} - {b.end_time.substring(0, 5)}
                      </td>
                      <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full ml-1.5"
                          style={{ backgroundColor: b.room_color || '#6366f1' }}
                        />
                        {roomName || `قاعة #${b.room_id}`}
                      </td>
                      <td className="p-3 text-slate-800 font-semibold">{b.booker_name}</td>
                      <td className="p-3 text-indigo-700">{b.entity_name}</td>
                      <td className="p-3 text-slate-900 max-w-xs truncate font-medium">{b.event_title}</td>
                      <td className="p-3 text-center font-mono text-slate-600">{b.attendees_count}</td>
                      <td className="p-3 whitespace-nowrap">
                        {b.status === 'confirmed' && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                            ✔ {t.filter.confirmed}
                          </span>
                        )}
                        {b.status === 'pending' && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold">
                            ⏳ {t.filter.pending}
                          </span>
                        )}
                        {b.status === 'cancelled' && (
                          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold">
                            ✖ {t.filter.cancelled}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap no-print">
                        <div className="flex items-center justify-center gap-1.5">
                          {b.status !== 'confirmed' && (
                            <button
                              onClick={() => onStatusChange(b.id, 'confirmed')}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 transition-all"
                              title="تأكيد الحجز"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {b.status !== 'cancelled' && (
                            <button
                              onClick={() => onStatusChange(b.id, 'cancelled')}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-600 transition-all"
                              title="إلغاء الحجز"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteBooking(b.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-all"
                            title="حذف من السجل"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
