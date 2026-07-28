'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Room, Booking, StatsData } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { StatsOverview } from '@/components/StatsOverview';
import { CalendarView } from '@/components/CalendarView';
import { SecretariatTable } from '@/components/SecretariatTable';
import { RoomsDirectory } from '@/components/RoomsDirectory';
import { BookingModal } from '@/components/BookingModal';
import { EditBookingModal } from '@/components/EditBookingModal';
import { AuthModal } from '@/components/AuthModal';
import { UsersManagement } from '@/components/UsersManagement';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { UserCheck, KeyRound, CheckCircle2, AlertTriangle, Check } from 'lucide-react';

export default function Home() {
  const { lang, t } = useLanguage();
  const { user, loading: authLoading, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState<'calendar' | 'logbook' | 'rooms' | 'users'>('calendar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const [modalInitialRoomId, setModalInitialRoomId] = useState<number | null>(null);
  const [modalInitialStartTime, setModalInitialStartTime] = useState<string | null>(null);
  
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Parallel data fetching (Performance P2) without calling init-db on load (Performance P1)
  const fetchData = useCallback(async () => {
    if (!user || user.status !== 'approved') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [roomsRes, bookingsRes, statsRes] = await Promise.all([
        fetch('/api/rooms'),
        fetch('/api/bookings'),
        fetch('/api/stats')
      ]);

      const [roomsData, bookingsData, statsData] = await Promise.all([
        roomsRes.json(),
        bookingsRes.json(),
        statsRes.json()
      ]);

      if (roomsData.rooms) setRooms(roomsData.rooms);
      if (bookingsData.bookings) setBookings(bookingsData.bookings);
      if (statsData.stats) setStats(statsData.stats);

    } catch (err) {
      console.error('Error loading data:', err);
    } fontally: {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      fetchData();
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!window.confirm(t.messages.deleteConfirm)) return;

    try {
      await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleSlotClick = (roomId: number, timeStr: string) => {
    setModalInitialRoomId(roomId);
    setModalInitialStartTime(timeStr);
    setIsModalOpen(true);
  };

  const handleSelectRoomForBooking = (roomId: number) => {
    setModalInitialRoomId(roomId);
    setModalInitialStartTime(null);
    setIsModalOpen(true);
  };

  const handlePrintLogbook = () => {
    setActiveTab('logbook');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)]">
        <div className="w-10 h-10 border-2 border-[var(--blue)] border-t-transparent rounded-full animate-spin mb-4 shadow-lg" />
        <p className="text-xs font-mono text-[var(--text-dim)] tracking-widest uppercase">
          {lang === 'ar' ? 'جاري التحقق من أمان وجلسة المستخدم...' : 'CONNECTING TO MISKRESERVE SYSTEM…'}
        </p>
      </div>
    );
  }

  const isApproved = user && user.status === 'approved';

  if (!isApproved) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col justify-between">
          
          {/* Top Navbar Header */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenBookingModal={() => openAuthModal('login')}
            onPrintLogbook={() => openAuthModal('login')}
          />

          {/* Desktop Commander Style Lock Screen Hero */}
          <main className="max-w-4xl mx-auto px-4 py-16 my-auto w-full">
            <div className="glass-panel rounded-3xl p-8 sm:p-14 border border-[rgba(74,222,128,0.25)] text-center shadow-2xl relative overflow-hidden bg-gradient-to-b from-[rgba(74,222,128,0.06)] via-transparent to-transparent">
              
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                
                {/* Status Line */}
                <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--green)] mb-4">
                  {t.lockScreen.statusReady}
                </div>

                {/* Pulsing Ring Checkmark */}
                <div className="check-big">
                  <Check className="w-8 h-8 text-[var(--green)] stroke-[2.5]" />
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text)] tracking-tight leading-tight pt-2">
                  {lang === 'ar' ? (
                    <>أهلاً بك في نظام <span className="gradient-text">مِسك رُومز</span></>
                  ) : (
                    <>Welcome to <span className="gradient-text">MiskReserve</span></>
                  )}
                </h1>

                <p className="text-sm sm:text-base text-[var(--text-dim)] leading-relaxed max-w-xl mx-auto">
                  {t.lockScreen.description}
                </p>

                {/* Pending approval notice if registered */}
                {user && user.status === 'pending' && (
                  <div className="p-4 rounded-2xl bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] text-amber-500 text-xs text-right ltr:text-left flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-sm mb-1 text-amber-600">{t.lockScreen.pendingNoticeTitle}</span>
                      <span className="text-[var(--text-dim)]">{t.lockScreen.pendingNoticeDesc}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--text)] hover:opacity-90 text-[var(--bg)] text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-4 h-4 text-[var(--bg)]" />
                    <span>{t.lockScreen.loginBtn}</span>
                  </button>

                  <button
                    onClick={() => openAuthModal('register')}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--stroke)] border border-[var(--stroke)] text-[var(--text)] text-sm font-medium hover:border-[var(--blue)] transition-all flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4 text-[var(--blue)]" />
                    <span>{t.lockScreen.registerBtn}</span>
                  </button>
                </div>

                {/* Default Admin Info Tip */}
                <div className="pt-6 border-t border-[var(--stroke)] text-xs font-mono text-[var(--text-faint)] flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--green)]" />
                  <span>{t.lockScreen.demoTip}</span>
                </div>

              </div>

            </div>
          </main>

          {/* Footer */}
          <footer className="text-center text-xs font-mono text-[var(--text-faint)] py-8 border-t border-[var(--stroke)]">
            © {new Date().getFullYear()} MiskTech - MiskReserve System
          </footer>

          {/* Login & Registration Modal */}
          <AuthModal />

        </div>
      </ErrorBoundary>
    );
  }

  // UNLOCKED SYSTEM: Logged in and Approved User Dashboard
  return (
    <ErrorBoundary>
      <div className="min-h-screen pb-16">
        
        {/* Top Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenBookingModal={() => {
            setModalInitialRoomId(null);
            setModalInitialStartTime(null);
            setIsModalOpen(true);
          }}
          onPrintLogbook={handlePrintLogbook}
        />

        {/* Main Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          
          {/* Banner Hero Card */}
          <div className="relative glass-panel rounded-3xl p-6 sm:p-10 border border-[var(--stroke)] overflow-hidden shadow-2xl">
            
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(125,169,255,0.12)] border border-[rgba(125,169,255,0.3)] text-[var(--blue)] font-mono text-xs font-semibold mb-4">
                <span className="dot-live"></span>
                <span>{t.companyName} SYSTEM ONLINE</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text)] leading-tight">
                {lang === 'ar' ? `مرحباً بك ${user.name} 👋` : `Welcome back, ${user.name} 👋`}
              </h1>
              <p className="text-sm sm:text-base text-[var(--text-dim)] mt-2 leading-relaxed font-sans">
                {t.hero.subtitle} (<strong className="text-[var(--text)]">{user.entity_name}</strong>)
              </p>
            </div>
          </div>

          {/* Live Metrics Overview */}
          <StatsOverview stats={stats} />

          {/* Main Content Area */}
          {loading ? (
            <div className="glass-panel rounded-3xl p-12 text-center text-[var(--text-dim)]">
              <div className="w-8 h-8 border-2 border-[var(--blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs font-mono">LOADING ROOMS & SCHEDULE DATA…</p>
            </div>
          ) : (
            <>
              {activeTab === 'calendar' && (
                <CalendarView
                  rooms={rooms}
                  bookings={bookings}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  onSlotClick={handleSlotClick}
                />
              )}

              {activeTab === 'logbook' && (
                <SecretariatTable
                  bookings={bookings}
                  onStatusChange={handleStatusChange}
                  onDeleteBooking={handleDeleteBooking}
                  onEditBooking={handleEditBooking}
                  onPrint={handlePrintLogbook}
                />
              )}

              {activeTab === 'rooms' && (
                <RoomsDirectory
                  rooms={rooms}
                  onSelectRoomForBooking={handleSelectRoomForBooking}
                />
              )}

              {activeTab === 'users' && user.role === 'admin' && (
                <UsersManagement />
              )}
            </>
          )}

        </main>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          rooms={rooms}
          onBookingSuccess={() => {
            fetchData();
          }}
          initialRoomId={modalInitialRoomId}
          initialDate={selectedDate}
          initialStartTime={modalInitialStartTime}
        />

        {/* Edit Booking Modal */}
        <EditBookingModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          booking={editingBooking}
          rooms={rooms}
          onBookingUpdated={() => {
            fetchData();
          }}
        />

        {/* Login & Registration Modal */}
        <AuthModal />

      </div>
    </ErrorBoundary>
  );
}
