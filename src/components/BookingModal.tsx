'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { X, AlertTriangle, CheckCircle2, Calendar, Clock, Users, Building2, User, FileText, Check, Tv, Mic, Monitor, Coffee, Video, HelpCircle } from 'lucide-react';

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

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onBookingSuccess: () => void;
  initialRoomId?: number | null;
  initialDate?: string | null;
  initialStartTime?: string | null;
}

import { useAuth } from '@/context/AuthContext';

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  rooms,
  onBookingSuccess,
  initialRoomId,
  initialDate,
  initialStartTime
}) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();

  const [roomId, setRoomId] = useState<number>(initialRoomId || (rooms[0]?.id || 1));
  const [bookerName, setBookerName] = useState(user?.name || '');
  const [entityName, setEntityName] = useState(user?.entity_name || '');
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('meeting');
  const [bookingDate, setBookingDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(initialStartTime || '09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [attendeesCount, setAttendeesCount] = useState(10);
  const [requestedEquipment, setRequestedEquipment] = useState<string[]>(['projector']);
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!bookerName) setBookerName(user.name);
      if (!entityName) setEntityName(user.entity_name);
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (initialRoomId) setRoomId(initialRoomId);
    if (initialDate) setBookingDate(initialDate);
    if (initialStartTime) {
      setStartTime(initialStartTime);
      // Auto set 2 hour duration default
      const [h, m] = initialStartTime.split(':').map(Number);
      const endH = Math.min(h + 2, 18);
      setEndTime(`${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }, [initialRoomId, initialDate, initialStartTime]);

  if (!isOpen) return null;

  const toggleEquipment = (eq: string) => {
    setRequestedEquipment(prev =>
      prev.includes(eq) ? prev.filter(item => item !== eq) : [...prev, eq]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setConflictWarning(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: roomId,
          booker_name: bookerName,
          entity_name: entityName,
          event_title: eventTitle,
          event_type: eventType,
          booking_date: bookingDate,
          start_time: startTime,
          end_time: endTime,
          attendees_count: attendeesCount,
          requested_equipment: requestedEquipment,
          notes
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.conflict) {
          setConflictWarning(`${t.modal.conflictWarning} (${data.conflictingBooking?.booker_name} - ${data.conflictingBooking?.event_title})`);
        } else {
          setErrorMessage(data.message || data.error || t.messages.errorAdd);
        }
      } else {
        onBookingSuccess();
        onClose();
        // Reset form
        setBookerName('');
        setEntityName('');
        setEventTitle('');
        setNotes('');
      }
    } catch (err: any) {
      setErrorMessage(t.messages.errorAdd);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel bg-white/95 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Calendar className="w-6 h-6 text-indigo-600" />
              {t.modal.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.modal.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conflict & Error Alerts */}
        {conflictWarning && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">تنبيه تضارب في المواعيد:</strong>
              {conflictWarning}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* Target Room Selection Cards */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t.modal.roomSelect} *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rooms.map((room) => {
                const isSelected = roomId === room.id;
                const name = lang === 'ar' ? room.name_ar : room.name_en;
                const loc = lang === 'ar' ? room.location_ar : room.location_en;

                return (
                  <div
                    key={room.id}
                    onClick={() => setRoomId(room.id)}
                    className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/30 shadow-md'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className="w-4 h-10 rounded-full shrink-0"
                      style={{ backgroundColor: room.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-indigo-700 font-mono font-semibold">
                          {room.code}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                        <span>{loc}</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          {room.capacity} {lang === 'ar' ? 'فرد' : 'pax'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booker & Entity Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                {t.modal.bookerName} *
              </label>
              <input
                type="text"
                required
                value={bookerName}
                onChange={(e) => setBookerName(e.target.value)}
                placeholder={t.modal.bookerNamePlaceholder}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                {t.modal.entityName} *
              </label>
              <input
                type="text"
                required
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder={t.modal.entityNamePlaceholder}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          {/* Event Title & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                {t.modal.eventTitle} *
              </label>
              <input
                type="text"
                required
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder={t.modal.eventTitlePlaceholder}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.modal.eventType}
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-white text-slate-900 border-slate-300"
              >
                <option value="training">{t.modal.types.training}</option>
                <option value="meeting">{t.modal.types.meeting}</option>
                <option value="workshop">{t.modal.types.workshop}</option>
                <option value="interview">{t.modal.types.interview}</option>
                <option value="other">{t.modal.types.other}</option>
              </select>
            </div>
          </div>

          {/* Date, Time & Attendees */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                {t.modal.bookingDate} *
              </label>
              <input
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                {t.modal.startTime} *
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                {t.modal.endTime} *
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                {t.modal.attendees}
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={attendeesCount}
                onChange={(e) => setAttendeesCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          {/* Equipment Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t.modal.equipment}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'projector', label: t.modal.equipmentList.projector, icon: Tv },
                { id: 'soundSystem', label: t.modal.equipmentList.soundSystem, icon: Mic },
                { id: 'whiteboard', label: t.modal.equipmentList.whiteboard, icon: Monitor },
                { id: 'videoconf', label: t.modal.equipmentList.videoconf, icon: Video },
                { id: 'hospitality', label: t.modal.equipmentList.hospitality, icon: Coffee },
                { id: 'laptops', label: t.modal.equipmentList.laptops, icon: Monitor },
              ].map((item) => {
                const isChecked = requestedEquipment.includes(item.id);
                const IconComp = item.icon;

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggleEquipment(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      isChecked
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <IconComp className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.modal.notes}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.modal.notesPlaceholder}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all"
            >
              {t.modal.cancel}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {submitting ? (
                <span>{t.modal.submitting}</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.modal.submit}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
