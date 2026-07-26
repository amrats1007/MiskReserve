'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { StatsOverview } from '@/components/StatsOverview';
import { CalendarView } from '@/components/CalendarView';
import { SecretariatTable } from '@/components/SecretariatTable';
import { RoomsDirectory } from '@/components/RoomsDirectory';
import { BookingModal } from '@/components/BookingModal';
import { AuthModal } from '@/components/AuthModal';
import { UsersManagement } from '@/components/UsersManagement';
import { Sparkles, Calendar, BookOpen, Building2, Lock, ShieldCheck, UserCheck, KeyRound, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Home() {
  const { lang, t } = useLanguage();
  const { user, loading: authLoading, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState<'calendar' | 'logbook' | 'rooms' | 'users'>('calendar');
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

  // Initialize DB and fetch data if user is authenticated and approved
  const fetchData = async () => {
    try {
      // 1. Ensure DB initialized
      await fetch('/api/init-db');

      if (user && user.status === 'approved') {
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
      }

    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

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

  // Show global loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-700">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold">جاري التحقق من أمان وجلسة المستخدم...</p>
      </div>
    );
  }

  // AUTHENTICATION GUARD: If user is not logged in or account is not approved
  const isApproved = user && user.status === 'approved';

  if (!isApproved) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-50">
        
        {/* Top Navbar Header */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenBookingModal={() => openAuthModal('login')}
          onPrintLogbook={() => openAuthModal('login')}
        />

        {/* Lock Screen Welcome Hero */}
        <main className="max-w-4xl mx-auto px-4 py-12 my-auto w-full">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-200 text-center shadow-xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/30 text-white">
                <Lock className="w-10 h-10" />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>نظام حماية وسجلات مسك رومز الخاص</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
                أهلاً بك في نظام مِسك رُومز
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                استخدام وشغل القاعات وسجل الحجوزات متاح حصرياً للموظفين والحسابات المعتمدة والمؤكدة من الإدارة. يرجى تسجيل الدخول أو إنشاء حساب جديد للبدء.
              </p>

              {/* Pending approval notice if registered */}
              {user && user.status === 'pending' && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold text-right flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-black text-sm mb-1 text-amber-800">حسابك قيد مراجعة وتفعيل الإدارة ⏳</span>
                    <span>تم استلام طلب التسجيل بنجاح، يمكنك استخدام النظام فور قيام مسؤول النظم باعتتماد طلبك.</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => openAuthModal('login')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white text-sm font-extrabold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>تسجيل الدخول إلى النظام</span>
                </button>

                <button
                  onClick={() => openAuthModal('register')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold shadow-xs hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span>إنشاء حساب موظف جديد</span>
                </button>
              </div>

              {/* Default Admin Info Tip */}
              <div className="pt-6 border-t border-slate-200/80 text-xs text-slate-500 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>حساب المشرف الافتراضي التجريبي: <strong>admin@misktech.com</strong> | كلمة المرور: <strong>admin123</strong></span>
              </div>

            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 py-6">
          جميع الحقوق محفوظة © {new Date().getFullYear()} MiskTech - MiskReserve
        </footer>

        {/* Login & Registration Modal */}
        <AuthModal />

      </div>
    );
  }

  // UNLOCKED SYSTEM: Logged in and Approved User Dashboard
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
        <div className="relative glass-panel rounded-3xl p-6 sm:p-10 border border-indigo-500/20 overflow-hidden shadow-lg">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.companyName}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              مرحباً بك {user.name} 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              {t.hero.subtitle} ({user.entity_name})
            </p>
          </div>
        </div>

        {/* Live Metrics Overview */}
        <StatsOverview stats={stats} />

        {/* Main Content Area */}
        {loading ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-slate-600">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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

      {/* Login & Registration Modal */}
      <AuthModal />

    </div>
  );
}
