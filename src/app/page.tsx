'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { StatsOverview } from '@/components/StatsOverview';
import { CalendarView } from '@/components/CalendarView';
import { SecretariatTable } from '@/components/SecretariatTable';
import { RoomsDirectory } from '@/components/RoomsDirectory';
import { BookingModal } from '@/components/BookingModal';
import { Sparkles, Calendar, BookOpen, Building2 } from 'lucide-react';

export default function Home() {
  const { lang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'calendar' | 'logbook' | 'rooms'>('calendar');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalInitialRoomId, setModalInitialRoomId] = useState<number | null>(null);
  const [modalInitialStartTime, setModalInitialStartTime] = useState<string | null>(null);
  
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Initialize DB and fetch data
  const fetchData = async () => {
    try {
      // 1. Ensure DB initialized
      await fetch('/api/init-db');

      // 2. Fetch Rooms
      const roomsRes = await fetch('/api/rooms');
      const roomsData = await roomsRes.json();
      if (roomsData.rooms) setRooms(roomsData.rooms);

      // 3. Fetch Bookings
      const bookingsRes = await fetch('/api/bookings');
      const bookingsData = await bookingsRes.json();
      if (bookingsData.bookings) setBookings(bookingsData.bookings);

      // 4. Fetch Stats
      const statsRes = await fetch('/api/stats');
      const statsData = await statsRes.json();
      if (statsData.stats) setStats(statsData.stats);

    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Status action from Secretariat Logbook
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

  // Delete Booking action
  const handleDeleteBooking = async (id: number) => {
    if (!window.confirm(t.messages.deleteConfirm)) return;

    try {
      await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Handle click on empty timeline slot in CalendarView
  const handleSlotClick = (roomId: number, timeStr: string) => {
    setModalInitialRoomId(roomId);
    setModalInitialStartTime(timeStr);
    setIsModalOpen(true);
  };

  // Select room from directory tab
  const handleSelectRoomForBooking = (roomId: number) => {
    setModalInitialRoomId(roomId);
    setModalInitialStartTime(null);
    setIsModalOpen(true);
  };

  // Print Logbook Handler
  const handlePrintLogbook = () => {
    setActiveTab('logbook');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
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
        
        {/* Banner Hero */}
        <div className="relative glass-panel rounded-3xl p-6 sm:p-10 border border-indigo-500/20 overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.companyName}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              {t.hero.subtitle}
            </p>
          </div>
        </div>

        {/* Live Metrics Overview */}
        <StatsOverview stats={stats} />

        {/* Main Content Area */}
        {loading ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-slate-400">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold">جاري تحميل سجل القاعات والبيانات...</p>
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
                onPrint={handlePrintLogbook}
              />
            )}

            {activeTab === 'rooms' && (
              <RoomsDirectory
                rooms={rooms}
                onSelectRoomForBooking={handleSelectRoomForBooking}
              />
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

    </div>
  );
}
