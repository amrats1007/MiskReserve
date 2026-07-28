'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Room } from '@/lib/types';
import { X, AlertTriangle, CheckCircle2, Calendar, Clock, Users, Building2, User, FileText, Check, Tv, Mic, Monitor, Coffee, Video } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onBookingSuccess: () => void;
  initialRoomId?: number | null;
  initialDate?: string | null;
  initialStartTime?: string | null;
}

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
  const [recurrenceType, setRecurrenceType] = useState<'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly'>('none');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');

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
      const [h, m] = initialStartTime.split(':').map(Number);
      const endH = Math.min(h + 2, 18);
      setEndTime(`${String(endH).padStart(2, '0')}:00`);
    }
  }, [initialRoomId, initialDate, initialStartTime, isOpen]);

  if (!isOpen) return null;

  const toggleEquipment = (itemKey: string) => {
    if (requestedEquipment.includes(itemKey)) {
      setRequestedEquipment(requestedEquipment.filter(k => k !== itemKey));
    } else {
      setRequestedEquipment([...requestedEquipment, itemKey]);
    }
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
          notes,
          recurrence_type: recurrenceType,
          recurrence_end_date: recurrenceType !== 'none' ? recurrenceEndDate : null
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]/80 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel bg-[var(--glass)] rounded-3xl p-6 sm:p-8 border border-[var(--stroke-bright)] shadow-2xl animate-in fade-in zoom-in duration-200 text-[var(--text)]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[var(--stroke)]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text)] flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[var(--blue)]" />
              {t.modal.title}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-dim)] mt-1 font-sans">{t.modal.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--stroke)] text-[var(--text-dim)] hover:text-[var(--text)] transition-all border border-[var(--stroke)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conflict & Error Alerts */}
        {conflictWarning && (
          <div className="mt-4 p-4 rounded-2xl bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] text-amber-500 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">تنبيه تضارب في المواعيد:</strong>
              {conflictWarning}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-[rgba(244,63,94,0.1)] border border-[rgba(244,63,94,0.3)] text-rose-500 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* Target Room Selection Cards */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-2">
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
                        ? 'bg-[rgba(125,169,255,0.15)] border-[var(--blue)] shadow-[0_0_20px_rgba(125,169,255,0.2)]'
                        : 'bg-[var(--input-bg)] border-[var(--stroke)] hover:bg-[var(--stroke)]'
                    }`}
                  >
                    <div
                      className="w-3.5 h-10 rounded-full shrink-0 shadow-[0_0_10px_currentColor]"
                      style={{ backgroundColor: room.color, color: room.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[var(--text)]">{name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--stroke)] text-[var(--blue)] font-mono">
                          {room.code}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono text-[var(--text-dim)] mt-1">
                        <span>{loc}</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-[var(--blue)]" />
                          {room.capacity}
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
              <label className="block text-xs font-mono font-medium text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[var(--blue)]" />
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
              <label className="block text-xs font-mono font-medium text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[var(--blue)]" />
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
              <label className="block text-xs font-mono font-medium text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[var(--blue)]" />
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
              <label className="block text-xs font-mono font-medium text-[var(--text-dim)] mb-1.5">
                {t.modal.eventType}
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-[var(--input-bg)] text-[var(--text)] border-[var(--stroke)] font-mono"
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[var(--input-bg)] border border-[var(--stroke)]">
            <div>
              <label className="block text-xs font-mono text-[var(--text-dim)] mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[var(--blue)]" />
                {t.modal.bookingDate} *
              </label>
              <input
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--text-dim)] mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[var(--blue)]" />
                {t.modal.startTime} *
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--text-dim)] mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[var(--blue)]" />
                {t.modal.endTime} *
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--text-dim)] mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[var(--blue)]" />
                {t.modal.attendees}
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={attendeesCount}
                onChange={(e) => setAttendeesCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
              />
            </div>
          </div>

          {/* Equipment Selection */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-dim)] mb-2">
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
                        ? 'bg-[rgba(125,169,255,0.15)] border-[var(--blue)] text-[var(--text)] font-semibold'
                        : 'bg-[var(--input-bg)] border-[var(--stroke)] text-[var(--text-dim)] hover:bg-[var(--stroke)] hover:text-[var(--text)]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isChecked ? 'bg-[var(--blue)] border-[var(--blue)] text-[var(--bg)]' : 'border-[var(--stroke)]'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <IconComp className="w-3.5 h-3.5 shrink-0 text-[var(--blue)]" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recurrence Settings */}
          <div className="p-4 rounded-2xl bg-[var(--input-bg)] border border-[var(--stroke)]">
            <h4 className="text-xs font-bold text-[var(--text)] mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--blue)]" />
              {t.modal.recurrence || 'التكرار الدائم (Recurrence)'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-[var(--text-dim)] mb-1">
                  {t.modal.recurrenceType || 'نوع التكرار'}
                </label>
                <select
                  value={recurrenceType}
                  onChange={(e: any) => setRecurrenceType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                >
                  <option value="none">{t.modal.recurrenceOptions?.none || 'بدون تكرار'}</option>
                  <option value="daily">{t.modal.recurrenceOptions?.daily || 'يومياً'}</option>
                  <option value="weekly">{t.modal.recurrenceOptions?.weekly || 'أسبوعياً'}</option>
                  <option value="biweekly">{t.modal.recurrenceOptions?.biweekly || 'كل أسبوعين'}</option>
                  <option value="monthly">{t.modal.recurrenceOptions?.monthly || 'شهرياً'}</option>
                </select>
              </div>

              {recurrenceType !== 'none' && (
                <div>
                  <label className="block text-[11px] font-mono text-[var(--text-dim)] mb-1">
                    {t.modal.recurrenceEndDate || 'تاريخ نهاية التكرار'}
                  </label>
                  <input
                    type="date"
                    required
                    value={recurrenceEndDate}
                    onChange={(e) => setRecurrenceEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-mono text-[var(--text-dim)] mb-1.5">
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
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--stroke)]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--stroke)] text-[var(--text-dim)] hover:text-[var(--text)] text-xs font-mono font-medium transition-all border border-[var(--stroke)]"
            >
              {t.modal.cancel}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--text)] hover:opacity-90 text-[var(--bg)] text-sm font-bold shadow-lg transition-all disabled:opacity-50"
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
