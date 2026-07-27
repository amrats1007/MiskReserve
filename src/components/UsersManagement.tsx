'use client';

import React, { useState, useEffect } from 'react';
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
        setActionMessage(status === 'approved' ? 'تمت الموافقة وتفعيل الحساب بنجاح.' : 'تم رفض طلب الحساب.');
        setTimeout(() => setActionMessage(null), 3000);
        fetchUsers();
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('هل أنت تأكد من رغبتك في حذف هذا الحساب نهائياً من النظام؟')) return;

    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setActionMessage('تم حذف الحساب بنجاح.');
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
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#7DA9FF]" />
            إدارة ومراجعة الحسابات الجديدة
          </h2>
          <p className="text-xs text-[#A2A7B3] mt-1 font-sans">مراجعة طلبات التسجيل الجدبدة، الموافقة عليها وتفعيل صلاحيات الدخول للنظام</p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[var(--stroke)] text-white text-xs font-mono font-medium transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-[#7DA9FF] ${loading ? 'animate-spin' : ''}`} />
          <span>REFRESH / تحديث</span>
        </button>
      </div>

      {/* Quick Status Badges Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-2xl border transition-all text-right flex items-center justify-between ${
            statusFilter === 'pending'
              ? 'bg-[rgba(245,158,11,0.15)] border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
              : 'glass-panel border-[var(--stroke)] hover:bg-[rgba(255,255,255,0.05)]'
          }`}
        >
          <div>
            <span className="text-xs font-mono font-semibold text-[#A2A7B3] block">PENDING / بانتظار الموافقة</span>
            <span className="text-2xl font-bold text-amber-400 font-mono mt-1 block">{pendingCount}</span>
          </div>
          <Clock className="w-6 h-6 text-amber-400" />
        </button>

        <button
          onClick={() => setStatusFilter('approved')}
          className={`p-4 rounded-2xl border transition-all text-right flex items-center justify-between ${
            statusFilter === 'approved'
              ? 'bg-[rgba(74,222,128,0.15)] border-[#4ADE80]/50 shadow-[0_0_20px_rgba(74,222,128,0.2)]'
              : 'glass-panel border-[var(--stroke)] hover:bg-[rgba(255,255,255,0.05)]'
          }`}
        >
          <div>
            <span className="text-xs font-mono font-semibold text-[#A2A7B3] block">APPROVED / حسابات معتمدة</span>
            <span className="text-2xl font-bold text-[#4ADE80] font-mono mt-1 block">{approvedCount}</span>
          </div>
          <CheckCircle className="w-6 h-6 text-[#4ADE80]" />
        </button>

        <button
          onClick={() => setStatusFilter('rejected')}
          className={`p-4 rounded-2xl border transition-all text-right flex items-center justify-between ${
            statusFilter === 'rejected'
              ? 'bg-[rgba(244,63,94,0.15)] border-rose-400/50 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
              : 'glass-panel border-[var(--stroke)] hover:bg-[rgba(255,255,255,0.05)]'
          }`}
        >
          <div>
            <span className="text-xs font-mono font-semibold text-[#A2A7B3] block">REJECTED / مرفوضة</span>
            <span className="text-2xl font-bold text-rose-400 font-mono mt-1 block">{rejectedCount}</span>
          </div>
          <XCircle className="w-6 h-6 text-rose-400" />
        </button>

        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border transition-all text-right flex items-center justify-between ${
            statusFilter === 'all'
              ? 'bg-[rgba(125,169,255,0.15)] border-[#7DA9FF]/50 shadow-[0_0_20px_rgba(125,169,255,0.2)]'
              : 'glass-panel border-[var(--stroke)] hover:bg-[rgba(255,255,255,0.05)]'
          }`}
        >
          <div>
            <span className="text-xs font-mono font-semibold text-[#A2A7B3] block">ALL / جميع الحسابات</span>
            <span className="text-2xl font-bold text-[#7DA9FF] font-mono mt-1 block">{users.length}</span>
          </div>
          <Users className="w-6 h-6 text-[#7DA9FF]" />
        </button>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.3)] text-[#4ADE80] text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#4ADE80]" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-[var(--stroke)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A2A7B3] absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث باسم المستخدم، البريد، أو الإدارة..."
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs font-mono"
          />
        </div>

        <div className="text-xs font-mono text-[#A2A7B3]">
          COUNT: {filteredUsers.length} / {users.length}
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-3xl p-6 border border-[var(--stroke)] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[rgba(255,255,255,0.03)] text-[#A2A7B3] font-mono font-bold uppercase tracking-wider border-b border-[var(--stroke)]">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">الاسم الكامل</th>
                <th className="p-3">البريد الإلكتروني</th>
                <th className="p-3">الجهة / الإدارة</th>
                <th className="p-3">الجوال</th>
                <th className="p-3">تاريخ الطلب</th>
                <th className="p-3">الحالة</th>
                <th className="p-3 text-center">إجراءات المراجعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--stroke)] font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#A2A7B3]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#7DA9FF]" />
                    <span className="font-mono">LOADING USERS DIRECTORY…</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#A2A7B3]">
                    <AlertCircle className="w-8 h-8 text-[#626772] mx-auto mb-2" />
                    لا توجد حسابات تطابق خيارات الفلترة المحددة.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="p-3 font-mono text-[#626772]">{idx + 1}</td>
                    <td className="p-3 font-bold text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[rgba(125,169,255,0.1)] text-[#7DA9FF] flex items-center justify-center font-bold text-xs border border-[rgba(125,169,255,0.2)] font-mono">
                          {u.name.substring(0, 2)}
                        </div>
                        <div>
                          <span>{u.name}</span>
                          {u.role === 'admin' && (
                            <span className="mr-1.5 text-[9px] px-2 py-0.5 rounded-full bg-[rgba(167,139,250,0.15)] text-[#A78BFA] font-mono font-bold border border-[rgba(167,139,250,0.3)]">
                              ADMIN
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-white font-mono dir-ltr text-right">{u.email}</td>
                    <td className="p-3 text-[#A78BFA] font-mono">{u.entity_name || '-'}</td>
                    <td className="p-3 text-[#A2A7B3] font-mono">{u.phone || '-'}</td>
                    <td className="p-3 text-[#A2A7B3] whitespace-nowrap font-mono">
                      {new Date(u.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {u.status === 'approved' && (
                        <span className="px-2.5 py-1 rounded-full bg-[rgba(74,222,128,0.12)] text-[#4ADE80] border border-[rgba(74,222,128,0.3)] font-mono text-[10px] font-bold">
                          ✔ APPROVED
                        </span>
                      )}
                      {u.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full bg-[rgba(245,158,11,0.12)] text-amber-400 border border-[rgba(245,158,11,0.3)] font-mono text-[10px] font-bold animate-pulse">
                          ⏳ PENDING
                        </span>
                      )}
                      {u.status === 'rejected' && (
                        <span className="px-2.5 py-1 rounded-full bg-[rgba(244,63,94,0.12)] text-rose-400 border border-[rgba(244,63,94,0.3)] font-mono text-[10px] font-bold">
                          ✖ REJECTED
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {u.status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(u.id, 'approved')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#4ADE80] hover:bg-emerald-400 text-[#07080B] text-xs font-bold transition-all shadow-[0_0_15px_rgba(74,222,128,0.3)]"
                            title="الموافقة وتفعيل الحساب"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>موافقة</span>
                          </button>
                        )}
                        {u.status !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(u.id, 'rejected')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[rgba(245,158,11,0.1)] hover:bg-[rgba(245,158,11,0.2)] border border-[rgba(245,158,11,0.3)] text-amber-400 text-xs font-bold transition-all"
                            title="رفض الحساب"
                          >
                            <XCircle className="w-3.5 h-3.5 text-amber-400" />
                            <span>رفض</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-xl bg-[rgba(244,63,94,0.1)] hover:bg-[rgba(244,63,94,0.2)] border border-[rgba(244,63,94,0.3)] text-rose-400 transition-all"
                          title="حذف الحساب"
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
