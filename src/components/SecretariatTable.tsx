'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Booking } from '@/lib/types';
import { Search, CheckCircle, XCircle, Trash2, Printer, Calendar, AlertCircle, Edit, Download } from 'lucide-react';

interface SecretariatTableProps {
  bookings: Booking[];
  onStatusChange: (id: number, status: string) => void;
  onDeleteBooking: (id: number) => void;
  onEditBooking: (booking: Booking) => void;
  onPrint: () => void;
}

export const SecretariatTable: React.FC<SecretariatTableProps> = ({
  bookings,
  onStatusChange,
  onDeleteBooking,
  onEditBooking,
  onPrint
}) => {
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    
    // Date range filter
    const bDate = b.booking_date ? b.booking_date.substring(0, 10) : '';
    const matchesStartDate = !startDate || bDate >= startDate;
    const matchesEndDate = !endDate || bDate <= endDate;

    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      (b.booker_name && b.booker_name.toLowerCase().includes(q)) ||
      (b.entity_name && b.entity_name.toLowerCase().includes(q)) ||
      (b.event_title && b.event_title.toLowerCase().includes(q)) ||
      (b.room_name_ar && b.room_name_ar.toLowerCase().includes(q)) ||
      (b.room_name_en && b.room_name_en.toLowerCase().includes(q));

    return matchesStatus && matchesStartDate && matchesEndDate && matchesSearch;
  });

  const handleExportCsv = () => {
    if (filteredBookings.length === 0) return;

    const headers = [
      'ID',
      'Date',
      'Start Time',
      'End Time',
      'Room',
      'Booker Name',
      'Entity',
      'Event Title',
      'Attendees',
      'Status'
    ];

    const rows = filteredBookings.map(b => [
      b.id,
      b.booking_date ? new Date(b.booking_date).toISOString().split('T')[0] : '',
      b.start_time ? b.start_time.substring(0, 5) : '',
      b.end_time ? b.end_time.substring(0, 5) : '',
      `"${lang === 'ar' ? (b.room_name_ar || b.room_id) : (b.room_name_en || b.room_id)}"`,
      `"${b.booker_name || ''}"`,
      `"${b.entity_name || ''}"`,
      `"${b.event_title || ''}"`,
      b.attendees_count || 1,
      b.status
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `misk_reserve_logbook_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="glass-panel p-6 rounded-3xl border border-[var(--stroke)] flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
        <div>
          <h2 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--blue)]" />
            {t.logbook.title}
          </h2>
          <p className="text-xs text-[var(--text-dim)] mt-1 font-sans">{t.logbook.subtitle}</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--stroke)] text-[var(--text)] text-xs font-mono font-medium border border-[var(--stroke)] transition-all shadow-lg"
          >
            <Download className="w-4 h-4 text-[var(--green)]" />
            <span>{t.nav.exportCsv}</span>
          </button>

          {/* Print Button */}
          <button
            onClick={onPrint}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--stroke)] text-[var(--text)] text-xs font-mono font-medium border border-[var(--stroke)] transition-all shadow-lg"
          >
            <Printer className="w-4 h-4 text-[var(--blue)]" />
            <span>{t.nav.printLogbook}</span>
          </button>
        </div>
      </div>

      {/* Search & Date Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-[var(--stroke)] flex flex-col lg:flex-row items-center justify-between gap-3">
        
        {/* Search Box */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-[var(--text-dim)] absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.filter.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs font-mono"
          />
        </div>

        {/* Date Range Inputs */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center gap-1 bg-[var(--input-bg)] px-3 py-1.5 rounded-xl border border-[var(--stroke)] text-xs font-mono text-[var(--text-dim)]">
            <span>{t.filter.startDate}:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-[var(--text)] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 bg-[var(--input-bg)] px-3 py-1.5 rounded-xl border border-[var(--stroke)] text-xs font-mono text-[var(--text-dim)]">
            <span>{t.filter.endDate}:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-[var(--text)] focus:outline-none"
            />
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs bg-[var(--input-bg)] text-[var(--text)] border-[var(--stroke)] font-mono"
          >
            <option value="all">{t.filter.allStatuses}</option>
            <option value="confirmed">{t.filter.confirmed}</option>
            <option value="pending">{t.filter.pending}</option>
            <option value="cancelled">{t.filter.cancelled}</option>
          </select>
        </div>

      </div>

      {/* Logbook Table Card */}
      <div className="glass-panel rounded-3xl p-6 border border-[var(--stroke)] overflow-hidden shadow-2xl">
        
        {/* Printable Header Title */}
        <div className="hidden print-only text-center mb-6">
          <h1 className="text-2xl font-bold text-black">{t.logbook.printTitle}</h1>
          <p className="text-sm text-gray-600">{t.logbook.printDate}: {new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right ltr:text-left text-xs">
            <thead className="bg-[var(--input-bg)] text-[var(--text-dim)] font-mono font-bold uppercase tracking-wider border-b border-[var(--stroke)]">
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
            <tbody className="divide-y divide-[var(--stroke)] font-medium">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-[var(--text-dim)]">
                    <AlertCircle className="w-8 h-8 text-[var(--text-faint)] mx-auto mb-2" />
                    {t.logbook.noData}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b, idx) => {
                  const roomName = lang === 'ar' ? b.room_name_ar : b.room_name_en;

                  return (
                    <tr key={b.id} className="hover:bg-[var(--input-bg)] transition-colors">
                      <td className="p-3 font-mono text-[var(--text-faint)]">{idx + 1}</td>
                      <td className="p-3 whitespace-nowrap font-mono text-[var(--blue)] font-semibold">
                        {new Date(b.booking_date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono text-[var(--text)]">
                        {b.start_time.substring(0, 5)} - {b.end_time.substring(0, 5)}
                      </td>
                      <td className="p-3 font-bold text-[var(--text)] whitespace-nowrap">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full mx-1.5 shadow-[0_0_8px_currentColor]"
                          style={{ backgroundColor: b.room_color || '#7DA9FF', color: b.room_color || '#7DA9FF' }}
                        />
                        {roomName || (lang === 'ar' ? `قاعة #${b.room_id}` : `Room #${b.room_id}`)}
                      </td>
                      <td className="p-3 text-[var(--text)] font-semibold">{b.booker_name}</td>
                      <td className="p-3 text-[var(--violet)] font-mono">{b.entity_name}</td>
                      <td className="p-3 text-[var(--text)] max-w-xs truncate font-medium">{b.event_title}</td>
                      <td className="p-3 text-center font-mono text-[var(--text-dim)]">{b.attendees_count}</td>
                      <td className="p-3 whitespace-nowrap">
                        {b.status === 'confirmed' && (
                          <span className="px-2.5 py-1 rounded-full bg-[rgba(74,222,128,0.15)] text-[var(--green)] border border-[rgba(74,222,128,0.3)] font-mono text-[10px] font-bold">
                            ✔ {t.filter.confirmed}
                          </span>
                        )}
                        {b.status === 'pending' && (
                          <span className="px-2.5 py-1 rounded-full bg-[rgba(245,158,11,0.15)] text-amber-500 border border-[rgba(245,158,11,0.3)] font-mono text-[10px] font-bold">
                            ⏳ {t.filter.pending}
                          </span>
                        )}
                        {b.status === 'cancelled' && (
                          <span className="px-2.5 py-1 rounded-full bg-[rgba(244,63,94,0.15)] text-rose-500 border border-[rgba(244,63,94,0.3)] font-mono text-[10px] font-bold">
                            ✖ {t.filter.cancelled}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap no-print">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Action Button */}
                          <button
                            onClick={() => onEditBooking(b)}
                            className="p-1.5 rounded-lg bg-[rgba(125,169,255,0.1)] hover:bg-[rgba(125,169,255,0.2)] border border-[rgba(125,169,255,0.3)] text-[var(--blue)] transition-all"
                            title={t.logbook.actionsTooltip.edit}
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {b.status !== 'confirmed' && (
                            <button
                              onClick={() => onStatusChange(b.id, 'confirmed')}
                              className="p-1.5 rounded-lg bg-[rgba(74,222,128,0.1)] hover:bg-[rgba(74,222,128,0.2)] border border-[rgba(74,222,128,0.3)] text-[var(--green)] transition-all"
                              title={t.logbook.actionsTooltip.confirm}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {b.status !== 'cancelled' && (
                            <button
                              onClick={() => onStatusChange(b.id, 'cancelled')}
                              className="p-1.5 rounded-lg bg-[rgba(245,158,11,0.1)] hover:bg-[rgba(245,158,11,0.2)] border border-[rgba(245,158,11,0.3)] text-amber-500 transition-all"
                              title={t.logbook.actionsTooltip.cancel}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteBooking(b.id)}
                            className="p-1.5 rounded-lg bg-[rgba(244,63,94,0.1)] hover:bg-[rgba(244,63,94,0.2)] border border-[rgba(244,63,94,0.3)] text-rose-500 transition-all"
                            title={t.logbook.actionsTooltip.delete}
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
