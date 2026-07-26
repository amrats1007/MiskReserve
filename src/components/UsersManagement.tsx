'use client';

import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Trash2, Clock, Search, Shield, Building2, Mail, Phone, AlertCircle, RefreshCw } from 'lucide-react';

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
      <div className="glass-panel p-6 rounded-3xl border border-indigo-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            إدارة ومراجعة الحسابات الجديدة
          </h2>
          <p className="text-xs text-slate-500 mt-1">مراجعة طلبات التسجيل الجدبدة، الموافقة عليها وتفعيل صلاحيات الدخول للنظام</p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs hover:border-indigo-300 hover:text-indigo-600 transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-indigo-600 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث القائمة</span>
        </button>
      </div>

      {/* Quick Status Badges Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-2xl border transition-all text-right flex items-center justify-between ${
            statusFilter === 'pending'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div>
            <span className="text-xs font-bold text-slate-500 block">طلبات بانتظار الموافقة</span>
            <span className="text-2xl font-black text-amber-700 font-mono mt-1 block">{pendingCount}</span>
          </div>
          <Clock className="w-6 h-6 text-amber-500" />
        </button>

        <button
          onClick={() => setStatusFilter('approved')}
          className={`p-4 rounded-2xl border transition-all text-right flex items-center justify-between ${
            statusFilter === 'approved'
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/30'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div>
            <span className="text-xs font-bold text-slate-500 block">حسابات مفعلة ومعتمدة</span>
            <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">{approvedCount}</span>
          </div>
          <CheckCircle className="w-6 h-6 text-emerald-500" />
        </button>

        <button
          onClick={() => setStatusFilter('rejected')}
          className={`p-4 rounded-2xl border transition-all text-right flex items-center justify-between ${
            statusFilter === 'rejected'
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/30'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div>
            <span className="text-xs font-bold text-slate-500 block">طلبات مرفوضة</span>
            <span className="text-2xl font-black text-rose-700 font-mono mt-1 block">{rejectedCount}</span>
          </div>
          <XCircle className="w-6 h-6 text-rose-500" />
        </button>

        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border transition-all text-right flex items-center justify-between ${
            statusFilter === 'all'
              ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-400/30'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div>
            <span className="text-xs font-bold text-slate-500 block">جميع الحسابات</span>
            <span className="text-2xl font-black text-indigo-700 font-mono mt-1 block">{users.length}</span>
          </div>
          <Users className="w-6 h-6 text-indigo-500" />
        </button>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث باسم المستخدم، البريد، أو الإدارة..."
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          عرض {filteredUsers.length} حساب من أصل {users.length}
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-200 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                    جاري تحميل قوام المستخدمين والطلبات...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    لا توجد حسابات تطابق خيارات الفلترة المحددة.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-slate-50/90 transition-colors">
                    <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
                          {u.name.substring(0, 2)}
                        </div>
                        <div>
                          <span>{u.name}</span>
                          {u.role === 'admin' && (
                            <span className="mr-1.5 text-[9px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold border border-purple-200">
                              مشرف
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-700 font-mono dir-ltr text-right">{u.email}</td>
                    <td className="p-3 text-indigo-700 font-semibold">{u.entity_name || '-'}</td>
                    <td className="p-3 text-slate-600 font-mono">{u.phone || '-'}</td>
                    <td className="p-3 text-slate-500 whitespace-nowrap font-mono">
                      {new Date(u.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {u.status === 'approved' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                          ✔ معتمد ومفعل
                        </span>
                      )}
                      {u.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold animate-pulse">
                          ⏳ قيد المراجعة
                        </span>
                      )}
                      {u.status === 'rejected' && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold">
                          ✖ مرفوض
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {u.status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(u.id, 'approved')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                            title="الموافقة وتفعيل الحساب"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>موافقة</span>
                          </button>
                        )}
                        {u.status !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(u.id, 'rejected')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold transition-all"
                            title="رفض الحساب"
                          >
                            <XCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>رفض</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-all"
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
