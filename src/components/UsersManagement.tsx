'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Users, CheckCircle, XCircle, Trash2, Clock, Search, Shield, AlertCircle, RefreshCw } from 'lucide-react';

interface UserRecord {
  id: number;
  name: string;
  email: string;
  entity_name: string;
  phone?: string;
  role: 'admin' | 'user';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export const UsersManagement: React.FC = () => {
  const { lang, t } = useLanguage();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(status === 'approved' ? t.users.approveSuccess : t.users.rejectSuccess);
        setTimeout(() => setActionMessage(null), 3000);
        fetchUsers();
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm(t.users.deleteConfirm)) return;

    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setActionMessage(t.users.deleteSuccess);
        setTimeout(() => setActionMessage(null), 3000);
        fetchUsers();
      }
    } catch (err) {
      console.error('Delete user error:', err);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.entity_name && u.entity_name.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const pendingCount = users.filter(u => u.status === 'pending').length;
  const approvedCount = users.filter(u => u.status === 'approved').length;
  const rejectedCount = users.filter(u => u.status === 'rejected').length;

  return (
    <div className="space-y-6">
      
      {/* Header & Status Metrics */}
      <div className="glass-panel p-6 rounded-3xl border border-[var(--stroke)] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--blue)]" />
            {t.users.title}
          </h2>
          <p className="text-xs text-[var(--text-dim)] mt-1 font-sans">{t.users.subtitle}</p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--stroke)] border border-[var(--stroke)] text-[var(--text)] text-xs font-mono font-medium transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-[var(--blue)] ${loading ? 'animate-spin' : ''}`} />
          <span>{t.users.refresh}</span>
        </button>
      </div>

      {/* Quick Status Badges Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-2xl border transition-all text-right ltr:text-left flex items-center justify-between ${
            statusFilter === 'pending'
              ? 'bg-[rgba(245,158,11,0.15)] border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
              : 'glass-panel border-[var(--stroke)] hover:bg-[var(--input-bg)]'
          }`}
        >
          <div>
            <span className="text-xs font-mono font-semibold text-[var(--text-dim)] block uppercase">{t.users.pending}</span>
            <span className="text-2xl font-bold text-amber-500 font-mono mt-1 block">{pendingCount}</span>
          </div>
          <Clock className="w-6 h-6 text-amber-500" />
        </button>

        <button
          onClick={() => setStatusFilter('approved')}
          className={`p-4 rounded-2xl border transition-all text-right ltr:text-left flex items-center justify-between ${
            statusFilter === 'approved'
              ? 'bg-[rgba(74,222,128,0.15)] border-[#4ADE80]/50 shadow-[0_0_20px_rgba(74,222,128,0.2)]'
              : 'glass-panel border-[var(--stroke)] hover:bg-[var(--input-bg)]'
          }`}
        >
          <div>
            <span className="text-xs font-mono font-semibold text-[var(--text-dim)] block uppercase">{t.users.approved}</span>
            <span className="text-2xl font-bold text-[var(--green)] font-mono mt-1 block">{approvedCount}</span>
          </div>
          <CheckCircle className="w-6 h-6 text-[var(--green)]" />
        </button>

        <button
          onClick={() => setStatusFilter('rejected')}
          className={`p-4 rounded-2xl border transition-all text-right ltr:text-left flex items-center justify-between ${
            statusFilter === 'rejected'
              ? 'bg-[rgba(244,63,94,0.15)] border-rose-400/50 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
              : 'glass-panel border-[var(--stroke)] hover:bg-[var(--input-bg)]'
          }`}
        >
          <div>
            <span className="text-xs font-mono font-semibold text-[var(--text-dim)] block uppercase">{t.users.rejected}</span>
            <span className="text-2xl font-bold text-rose-500 font-mono mt-1 block">{rejectedCount}</span>
          </div>
          <XCircle className="w-6 h-6 text-rose-500" />
        </button>

        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border transition-all text-right ltr:text-left flex items-center justify-between ${
            statusFilter === 'all'
              ? 'bg-[rgba(125,169,255,0.15)] border-[#7DA9FF]/50 shadow-[0_0_20px_rgba(125,169,255,0.2)]'
              : 'glass-panel border-[var(--stroke)] hover:bg-[var(--input-bg)]'
          }`}
        >
          <div>
            <span className="text-xs font-mono font-semibold text-[var(--text-dim)] block uppercase">{t.users.all}</span>
            <span className="text-2xl font-bold text-[var(--blue)] font-mono mt-1 block">{users.length}</span>
          </div>
          <Users className="w-6 h-6 text-[var(--blue)]" />
        </button>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-[rgba(74,222,128,0.12)] border border-[rgba(74,222,128,0.3)] text-[var(--green)] text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[var(--green)]" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-[var(--stroke)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--text-dim)] absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.users.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs font-mono"
          />
        </div>

        <div className="text-xs font-mono text-[var(--text-dim)]">
          {t.users.countLabel}: {filteredUsers.length} / {users.length}
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-3xl p-6 border border-[var(--stroke)] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right ltr:text-left text-xs">
            <thead className="bg-[var(--input-bg)] text-[var(--text-dim)] font-mono font-bold uppercase tracking-wider border-b border-[var(--stroke)]">
              <tr>
                <th className="p-3">{t.users.table.id}</th>
                <th className="p-3">{t.users.table.name}</th>
                <th className="p-3">{t.users.table.email}</th>
                <th className="p-3">{t.users.table.entity}</th>
                <th className="p-3">{t.users.table.phone}</th>
                <th className="p-3">{t.users.table.date}</th>
                <th className="p-3">{t.users.table.status}</th>
                <th className="p-3 text-center">{t.users.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--stroke)] font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[var(--text-dim)]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--blue)]" />
                    <span className="font-mono">LOADING USERS DIRECTORY…</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[var(--text-dim)]">
                    <AlertCircle className="w-8 h-8 text-[var(--text-faint)] mx-auto mb-2" />
                    {t.users.noUsers}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-[var(--input-bg)] transition-colors">
                    <td className="p-3 font-mono text-[var(--text-faint)]">{idx + 1}</td>
                    <td className="p-3 font-bold text-[var(--text)] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[rgba(125,169,255,0.12)] text-[var(--blue)] flex items-center justify-center font-bold text-xs border border-[rgba(125,169,255,0.25)] font-mono">
                          {u.name.substring(0, 2)}
                        </div>
                        <div>
                          <span>{u.name}</span>
                          {u.role === 'admin' && (
                            <span className="mx-1.5 text-[9px] px-2 py-0.5 rounded-full bg-[rgba(167,139,250,0.15)] text-[var(--violet)] font-mono font-bold border border-[rgba(167,139,250,0.3)]">
                              {t.users.table.adminTag}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[var(--text)] font-mono dir-ltr text-right ltr:text-left">{u.email}</td>
                    <td className="p-3 text-[var(--violet)] font-mono">{u.entity_name || '-'}</td>
                    <td className="p-3 text-[var(--text-dim)] font-mono">{u.phone || '-'}</td>
                    <td className="p-3 text-[var(--text-dim)] whitespace-nowrap font-mono">
                      {new Date(u.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {u.status === 'approved' && (
                        <span className="px-2.5 py-1 rounded-full bg-[rgba(74,222,128,0.15)] text-[var(--green)] border border-[rgba(74,222,128,0.3)] font-mono text-[10px] font-bold">
                          ✔ {t.users.table.approvedStatus}
                        </span>
                      )}
                      {u.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full bg-[rgba(245,158,11,0.15)] text-amber-500 border border-[rgba(245,158,11,0.3)] font-mono text-[10px] font-bold animate-pulse">
                          ⏳ {t.users.table.pendingStatus}
                        </span>
                      )}
                      {u.status === 'rejected' && (
                        <span className="px-2.5 py-1 rounded-full bg-[rgba(244,63,94,0.15)] text-rose-500 border border-[rgba(244,63,94,0.3)] font-mono text-[10px] font-bold">
                          ✖ {t.users.table.rejectedStatus}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {u.status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(u.id, 'approved')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--green)] hover:opacity-90 text-[var(--bg)] text-xs font-bold transition-all shadow-md"
                            title={t.users.table.approveBtn}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{t.users.table.approveBtn}</span>
                          </button>
                        )}
                        {u.status !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(u.id, 'rejected')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[rgba(245,158,11,0.1)] hover:bg-[rgba(245,158,11,0.2)] border border-[rgba(245,158,11,0.3)] text-amber-500 text-xs font-bold transition-all"
                            title={t.users.table.rejectBtn}
                          >
                            <XCircle className="w-3.5 h-3.5 text-amber-500" />
                            <span>{t.users.table.rejectBtn}</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-xl bg-[rgba(244,63,94,0.1)] hover:bg-[rgba(244,63,94,0.2)] border border-[rgba(244,63,94,0.3)] text-rose-500 transition-all"
                          title={t.users.table.deleteBtn}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
