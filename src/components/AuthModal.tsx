'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { X, LogIn, UserPlus, Mail, Lock, User, Building2, Phone, AlertCircle, Clock } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { lang, t } = useLanguage();
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
      setErrorMessage(res.message || (lang === 'ar' ? 'فشل تسجيل الدخول.' : 'Authentication failed.'));
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
      setSuccessMessage(lang === 'ar' 
        ? 'تم إرسال طلب إنشاء الحساب بنجاح! حسابك الآن قيد مراجعة واعتماد الإدارة قبل تسجيل الدخول.'
        : 'Registration request submitted! Your account is pending admin approval before sign in.'
      );
      setName('');
      setPassword('');
      setPhone('');
    } else {
      setErrorMessage(res.message || (lang === 'ar' ? 'فشل إنشاء الحساب.' : 'Registration failed.'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07080B]/80 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel bg-[var(--glass-bright)] rounded-3xl p-6 sm:p-8 border border-[var(--stroke-bright)] shadow-2xl animate-in fade-in zoom-in duration-200 text-[var(--text)]">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute left-5 top-5 ltr:left-auto ltr:right-5 p-2 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--stroke)] text-[var(--text-dim)] hover:text-[var(--text)] transition-all border border-[var(--stroke)]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[var(--input-bg)] rounded-2xl border border-[var(--stroke)] mb-6 mt-2">
          <button
            onClick={() => {
              setTab('login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'login'
                ? 'bg-[var(--text)] text-[var(--bg)] shadow-md'
                : 'text-[var(--text-dim)] hover:text-[var(--text)]'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>{t.authModal.loginTab}</span>
          </button>

          <button
            onClick={() => {
              setTab('register');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'register'
                ? 'bg-[var(--text)] text-[var(--bg)] shadow-md'
                : 'text-[var(--text-dim)] hover:text-[var(--text)]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.authModal.registerTab}</span>
          </button>
        </div>

        {/* Notifications / Alerts */}
        {errorMessage && (
          <div className="mb-5 p-4 rounded-2xl bg-[rgba(244,63,94,0.1)] border border-[rgba(244,63,94,0.3)] text-rose-500 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-4 rounded-2xl bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] text-amber-500 text-xs flex items-start gap-2.5 leading-relaxed">
            <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-1">{lang === 'ar' ? 'طلبك قيد الاعتماد:' : 'Pending Approval:'}</strong>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[var(--blue)]" />
                {t.authModal.email}
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
              <label className="block text-xs font-mono text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[var(--blue)]" />
                {t.authModal.password}
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
                className="w-full py-3 rounded-xl bg-[var(--text)] hover:opacity-90 text-[var(--bg)] text-xs font-bold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>{t.authModal.loggingIn}</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>{t.authModal.submitLogin}</span>
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
              <label className="block text-xs font-mono text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[var(--blue)]" />
                {t.authModal.fullName}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'ar' ? 'م. محمد عبد الله' : 'Eng. Mohammed Abdullah'}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[var(--blue)]" />
                {t.authModal.email}
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
              <label className="block text-xs font-mono text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[var(--blue)]" />
                {t.authModal.password}
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
                <label className="block text-xs font-mono text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[var(--blue)]" />
                  {t.authModal.entityName}
                </label>
                <input
                  type="text"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  placeholder={lang === 'ar' ? 'إدارة نظم المعلومات' : 'IT Department'}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[var(--blue)]" />
                  {t.authModal.phone}
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
                className="w-full py-3 rounded-xl bg-[var(--text)] hover:opacity-90 text-[var(--bg)] text-xs font-bold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>{t.authModal.submittingRegister}</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>{t.authModal.submitRegister}</span>
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
