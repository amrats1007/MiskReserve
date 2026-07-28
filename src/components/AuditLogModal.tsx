'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AuditLog } from '@/lib/types';
import { X, ShieldCheck, Activity, Search, RefreshCw, Calendar, User, Clock } from 'lucide-react';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/audit');
      const data = await res.json();
      if (data.success && data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter(log => {
    const q = searchTerm.toLowerCase();
    return !searchTerm ||
      (log.user_name && log.user_name.toLowerCase().includes(q)) ||
      (log.action && log.action.toLowerCase().includes(q)) ||
      (log.target_type && log.target_type.toLowerCase().includes(q)) ||
      (log.details && log.details.toLowerCase().includes(q));
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]/80 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel bg-[var(--glass-bright)] rounded-3xl p-6 sm:p-8 border border-[var(--stroke-bright)] shadow-2xl animate-in fade-in zoom-in duration-200 text-[var(--text)] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[var(--stroke)] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(99,102,241,0.15)] text-[var(--blue)] flex items-center justify-center border border-[rgba(99,102,241,0.3)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text)]">
                {lang === 'ar' ? 'سجل تدقيق الأمان والعمليات (Audit Log)' : 'Security & Operations Audit Log'}
              </h2>
              <p className="text-xs text-[var(--text-dim)]">
                {lang === 'ar' ? 'تتبع كامل لجميع التحركات والإجراءات الإدارية في النظام' : 'Full traceability of admin actions and system events'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--stroke)] text-[var(--text-dim)] hover:text-[var(--text)] transition-all border border-[var(--stroke)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Refresh Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 ltr:right-3 ltr:left-auto top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
            <input
              type="text"
              placeholder={lang === 'ar' ? 'البحث بالاسم، الإجراء، أو التفاصيل...' : 'Search by name, action, or details...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 ltr:pl-3 ltr:pr-9 py-2 rounded-xl bg-[var(--input-bg)] border border-[var(--stroke)] text-xs text-[var(--text)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--blue)]"
            />
          </div>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--stroke)] text-xs font-semibold text-[var(--text)] flex items-center gap-2 transition-all border border-[var(--stroke)]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{lang === 'ar' ? 'تحديث السجل' : 'Refresh Logs'}</span>
          </button>
        </div>

        {/* Logs List Table */}
        <div className="overflow-y-auto flex-1 rounded-2xl border border-[var(--stroke)] bg-[var(--bg)]/50">
          {loading ? (
            <div className="p-8 text-center text-xs text-[var(--text-dim)]">
              {lang === 'ar' ? 'جاري تحميل سجل التدقيق...' : 'Loading audit logs...'}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-dim)]">
              {lang === 'ar' ? 'لا توجد سجلات تدقيق مطابقة' : 'No audit log entries found'}
            </div>
          ) : (
            <table className="w-full text-right ltr:text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--input-bg)] text-[var(--text-dim)] font-semibold border-b border-[var(--stroke)]">
                  <th className="p-3">#</th>
                  <th className="p-3">{lang === 'ar' ? 'الوقت والتاريخ' : 'Date & Time'}</th>
                  <th className="p-3">{lang === 'ar' ? 'المستخدم' : 'User'}</th>
                  <th className="p-3">{lang === 'ar' ? 'الإجراء' : 'Action'}</th>
                  <th className="p-3">{lang === 'ar' ? 'التفاصيل' : 'Details'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--stroke)] text-[var(--text)] font-mono">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--stroke)]/30 transition-colors">
                    <td className="p-3 text-[var(--text-dim)]">{log.id}</td>
                    <td className="p-3 whitespace-nowrap text-[11px] text-[var(--text-dim)]">
                      {log.created_at ? new Date(log.created_at).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US') : '-'}
                    </td>
                    <td className="p-3 font-sans font-medium text-[var(--blue)]">
                      {log.user_name || 'System'}
                    </td>
                    <td className="p-3 font-sans">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[rgba(99,102,241,0.1)] text-[var(--blue)] border border-[rgba(99,102,241,0.2)]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-sans text-xs text-[var(--text-dim)] leading-relaxed max-w-xs truncate">
                      {log.details || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};
