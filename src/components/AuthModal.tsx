'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, LogIn, UserPlus, Mail, Lock, User, Building2, Phone, AlertCircle, Clock } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalDefaultTab, login, register } = useAuth();

  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [entityName, setEntityName] = useState('');
  const [phone, setPhone] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setTab(authModalDefaultTab);
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [authModalDefaultTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.message || 'فشل تسجيل الدخول.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSubmitting(true);

    const res = await register(name, email, password, entityName, phone);
    setSubmitting(false);

    if (res.success) {
      setSuccessMessage('تم إرسال طلب إنشاء الحساب بنجاح! حسابك الآن قيد مراجعة واعتماد الإدارة قبل تسجيل الدخول.');
      setName('');
      setPassword('');
      setPhone('');
    } else {
      setErrorMessage(res.message || 'فشل إنشاء الحساب.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07080B]/80 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel bg-[#0a0b0f]/95 rounded-3xl p-6 sm:p-8 border border-[var(--stroke-bright)] shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-200 text-white">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute left-5 top-5 p-2 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[#A2A7B3] hover:text-white transition-all border border-[var(--stroke)]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[rgba(255,255,255,0.03)] rounded-2xl border border-[var(--stroke)] mb-6 mt-2">
          <button
            onClick={() => {
              setTab('login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'login'
                ? 'bg-[#F4F5F7] text-[#07080B] shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                : 'text-[#A2A7B3] hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول</span>
          </button>

          <button
            onClick={() => {
              setTab('register');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'register'
                ? 'bg-[#F4F5F7] text-[#07080B] shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                : 'text-[#A2A7B3] hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>حساب جديد</span>
          </button>
        </div>

        {/* Notifications / Alerts */}
        {errorMessage && (
          <div className="mb-5 p-4 rounded-2xl bg-[rgba(244,63,94,0.1)] border border-[rgba(244,63,94,0.3)] text-rose-200 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-4 rounded-2xl bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] text-amber-200 text-xs flex items-start gap-2.5 leading-relaxed">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-1">طلبك قيد الاعتماد:</strong>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#A2A7B3] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#7DA9FF]" />
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@misktech.com"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#A2A7B3] mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#7DA9FF]" />
                كلمة المرور *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#F4F5F7] hover:bg-white text-[#07080B] text-xs font-bold shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(125,169,255,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>جاري التحقق...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>الدخول إلى النظام</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#A2A7B3] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#7DA9FF]" />
                الاسم الكامل *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="م. محمد عبد الله"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#A2A7B3] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#7DA9FF]" />
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@misktech.com"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#A2A7B3] mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#7DA9FF]" />
                كلمة المرور *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#A2A7B3] mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#7DA9FF]" />
                  الجهة / الإدارة
                </label>
                <input
                  type="text"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  placeholder="إدارة نظم المعلومات"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A2A7B3] mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#7DA9FF]" />
                  رقم الجوال
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#F4F5F7] hover:bg-white text-[#07080B] text-xs font-bold shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(125,169,255,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>جاري إرسال الطلب...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>إرسال طلب التسجيل للمراجعة</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
