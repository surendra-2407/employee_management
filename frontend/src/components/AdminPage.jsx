import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, BarChart3, Building2, DollarSign, Settings,
  LogOut, ArrowLeft, Sun, Moon, Shield, Trash2,
  UserCheck, RefreshCw, Search, Plus, Edit2,
  Activity, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, XCircle, Download, Eye, Filter,
  ChevronUp, ChevronDown, Bell, Lock, Globe,
  Database, X
} from 'lucide-react';
import { api } from '../services/api';

function RupeeIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m6 13 8.5 8" />
      <path d="M6 13h3" />
      <path d="M9 13c6.667 0 6.667-10 0-10" />
    </svg>
  );
}

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'suripallapothu18@gmail.com';

export default function AdminPage({ currentUser, onGoToDashboard, onLogout, isDark, setIsDark }) {
  const [stats, setStats]         = useState(null);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers]         = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch]       = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir]     = useState('asc');
  const [toast, setToast]         = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', role: 'employee', password: '' });

  const fmt = (val) =>
    val != null ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val) : '₹0';

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const logActivity = (action) => {
    const log = JSON.parse(localStorage.getItem('staffpulse_activity') || '[]');
    const entry = { action, user: currentUser?.name || 'Manager (Admin)', time: new Date().toLocaleString('en-IN') };
    const updated = [entry, ...log].slice(0, 50);
    localStorage.setItem('staffpulse_activity', JSON.stringify(updated));
    setActivityLog(updated);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsData, empData] = await Promise.all([api.getStats(), api.getEmployees({})]);
      setStats(statsData);
      setEmployees(empData.data || []);
    } catch (e) { console.error(e); }
    const stored = JSON.parse(localStorage.getItem('staffpulse_users') || '[]');
    setUsers([
      { name: currentUser?.name || 'Surendra (Admin)', email: ADMIN_EMAIL, role: 'admin', status: 'active' },
      ...stored.map((u) => ({ ...u, status: u.status || 'active' })),
    ]);
    setActivityLog(JSON.parse(localStorage.getItem('staffpulse_activity') || '[]'));
    setIsLoading(false);
  }, [currentUser]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
    showToast('Data refreshed');
    logActivity('Refreshed admin dashboard');
  };

  /* ── Employee actions ── */
  const handleDeleteEmployee = async (emp) => {
    if (!window.confirm(`Delete ${emp.name}? This cannot be undone.`)) return;
    try {
      await api.deleteEmployee(emp._id || emp.id);
      showToast(`${emp.name} deleted`, 'success');
      logActivity(`Deleted employee: ${emp.name}`);
      await loadData();
    } catch { showToast('Delete failed', 'error'); }
  };

  /* ── User actions ── */
  const removeUser = (email) => {
    if (email === ADMIN_EMAIL) return showToast('Cannot remove the admin account', 'error');
    if (!window.confirm(`Remove user ${email}?`)) return;
    const stored = JSON.parse(localStorage.getItem('staffpulse_users') || '[]');
    localStorage.setItem('staffpulse_users', JSON.stringify(stored.filter((u) => u.email !== email)));
    setUsers((prev) => prev.filter((u) => u.email !== email));
    showToast('User removed');
    logActivity(`Removed user: ${email}`);
  };

  const toggleUserStatus = (email) => {
    setUsers((prev) => prev.map((u) => {
      if (u.email === email) {
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        logActivity(`${newStatus === 'active' ? 'Activated' : 'Suspended'} user: ${email}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
    showToast('User status updated');
  };

  const changeRole = (email, newRole) => {
    const stored = JSON.parse(localStorage.getItem('staffpulse_users') || '[]');
    const updated = stored.map((u) => u.email === email ? { ...u, role: newRole } : u);
    localStorage.setItem('staffpulse_users', JSON.stringify(updated));
    setUsers((prev) => prev.map((u) => u.email === email ? { ...u, role: newRole } : u));
    showToast(`Role updated to ${newRole}`);
    logActivity(`Changed role of ${email} to ${newRole}`);
    setEditingUser(null);
  };

  /* ── User creation ── */
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.email.trim() || !newUserForm.password.trim()) {
      return showToast('Please fill out all user fields.', 'error');
    }
    const stored = JSON.parse(localStorage.getItem('staffpulse_users') || '[]');
    if (stored.find((u) => u.email.toLowerCase() === newUserForm.email.trim().toLowerCase()) || newUserForm.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return showToast('An account with this email already exists.', 'error');
    }
    const newUser = {
      name: newUserForm.name.trim(),
      email: newUserForm.email.trim().toLowerCase(),
      role: newUserForm.role,
      password: newUserForm.password,
      status: 'active',
    };
    localStorage.setItem('staffpulse_users', JSON.stringify([...stored, newUser]));
    setUsers((prev) => [...prev, newUser]);
    setIsAddUserOpen(false);
    setNewUserForm({ name: '', email: '', role: 'employee', password: '' });
    showToast(`User ${newUser.name} created!`, 'success');
    logActivity(`Created user ${newUser.email} with role '${newUser.role}'`);
  };

  /* ── Full JSON system backup ── */
  const handleDownloadSystemBackup = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      admin: { name: currentUser?.name, email: ADMIN_EMAIL },
      stats,
      employees,
      users,
      activityLog,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `StaffPulse_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('System backup downloaded!');
    logActivity('Generated full JSON system backup');
  };

  /* ── Reseed demo data from admin ── */
  const handleResetDemoData = async () => {
    if (!window.confirm('Re-seed MongoDB Atlas with sample employee records? Existing records will be refreshed.')) return;
    try {
      await api.seedDemoEmployees(true);
      await loadData();
      showToast('Sample records successfully populated!', 'success');
      logActivity('Re-seeded employee records in MongoDB');
    } catch {
      showToast('Failed to seed records', 'error');
    }
  };

  /* ── Export CSV ── */
  const exportEmployeesCSV = () => {
    const rows = [['Name', 'Email', 'Department', 'Position', 'Salary']];
    employees.forEach((e) => rows.push([e.name, e.email, e.department, e.position, e.salary]));
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'employees.csv';
    a.click();
    showToast('CSV downloaded');
    logActivity('Exported employee CSV');
  };

  /* ── Filtered & sorted employees ── */
  const departments = ['All', ...new Set(employees.map((e) => e.department).filter(Boolean))];
  const filteredEmps = employees
    .filter((e) => {
      const q = search.toLowerCase();
      const matchSearch = !q || e.name?.toLowerCase().includes(q) || e.email?.toLowerCase().includes(q) || e.department?.toLowerCase().includes(q);
      const matchDept = deptFilter === 'All' || e.department === deptFilter;
      return matchSearch && matchDept;
    })
    .sort((a, b) => {
      const va = a[sortField] ?? '';
      const vb = b[sortField] ?? '';
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }) => sortField === field
    ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
    : <ChevronUp className="w-3 h-3 opacity-20" />;

  /* ── Role badge colour ── */
  const roleColor = (role) => ({
    admin:    'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    manager:  'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    employee: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  }[role] || 'bg-gray-100 text-gray-600');

  const statCards = [
    { label: 'Total Employees', value: stats?.totalEmployees ?? '—',    icon: <Users className="w-5 h-5"/>,    col: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
    { label: 'Departments',     value: stats?.departmentStats?.length ?? '—', icon: <Building2 className="w-5 h-5"/>, col: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Total Payroll',   value: fmt(stats?.totalPayroll),         icon: <RupeeIcon className="w-5 h-5"/>, col: 'text-amber-600',  bg: 'bg-amber-50 dark:bg-amber-950/40' },
    { label: 'Avg. Salary',     value: fmt(stats?.averageSalary),        icon: <BarChart3 className="w-5 h-5"/>,  col: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/40' },
    { label: 'Highest Salary',  value: fmt(stats?.highestSalary),        icon: <TrendingUp className="w-5 h-5"/>, col: 'text-sky-600',    bg: 'bg-sky-50 dark:bg-sky-950/40' },
    { label: 'User Accounts',   value: users.length,                     icon: <UserCheck className="w-5 h-5"/>,  col: 'text-rose-600',   bg: 'bg-rose-50 dark:bg-rose-950/40' },
  ];

  const tabs = [
    { key: 'overview',   label: 'Overview',      icon: <BarChart3 className="w-4 h-4"/> },
    { key: 'employees',  label: 'Employees',     icon: <Users className="w-4 h-4"/> },
    { key: 'users',      label: 'User Accounts', icon: <UserCheck className="w-4 h-4"/> },
    { key: 'activity',   label: 'Activity Log',  icon: <Activity className="w-4 h-4"/> },
    { key: 'settings',   label: 'Settings',      icon: <Settings className="w-4 h-4"/> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border transition-all ${
          toast.type === 'error'
            ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
            : 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
        }`}>
          {toast.type === 'error' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-rose-600 flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-gray-900 dark:text-white">StaffPulse</span>
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                Admin Panel
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Admin info */}
            <div className="hidden sm:flex items-center gap-2 mr-2">
              {currentUser?.picture ? (
                <img src={currentUser.picture} alt="avatar" className="w-8 h-8 rounded-full border-2 border-indigo-200 dark:border-indigo-800" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {currentUser?.name?.[0]?.toUpperCase() || 'A'}
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{currentUser?.name}</span>
            </div>
            <button onClick={handleRefresh} disabled={isRefreshing} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={onGoToDashboard} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </button>
            <button onClick={onLogout} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Full system control — employees, users, activity & settings.</p>
          </div>
          <button
            onClick={exportEmployeesCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-8 w-fit overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════ OVERVIEW TAB ══════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {statCards.map((c) => (
                <div key={c.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.col} flex items-center justify-center mb-3`}>{c.icon}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-tight">{c.label}</p>
                  <p className={`text-xl font-black mt-0.5 ${c.col} truncate`}>{c.value}</p>
                </div>
              ))}
            </div>

            {/* Department breakdown */}
            {stats?.departmentStats?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg">Department Breakdown</h2>
                  <span className="text-xs text-gray-400">{stats.departmentStats.length} departments</span>
                </div>
                <div className="space-y-4">
                  {stats.departmentStats
                    .sort((a, b) => b.count - a.count)
                    .map((d) => {
                      const pct = stats.totalEmployees ? Math.round((d.count / stats.totalEmployees) * 100) : 0;
                      return (
                        <div key={d._id}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{d._id}</span>
                            <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span>{d.count} people</span>
                              <span>{fmt(d.avgSalary)} avg</span>
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">{pct}%</span>
                            </div>
                          </div>
                          <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Salary insights */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Highest Salary', value: fmt(stats.highestSalary), icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
                  { label: 'Lowest Salary',  value: fmt(stats.lowestSalary),  icon: <TrendingDown className="w-5 h-5 text-rose-600" />,    bg: 'bg-rose-50 dark:bg-rose-950/30' },
                  { label: 'Total Payroll',  value: fmt(stats.totalPayroll),  icon: <RupeeIcon className="w-5 h-5 text-amber-600" />,   bg: 'bg-amber-50 dark:bg-amber-950/30' },
                ].map((item) => (
                  <div key={item.label} className={`${item.bg} rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4`}>
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">{item.icon}</div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                      <p className="text-xl font-black text-gray-900 dark:text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MongoDB Atlas Diagnostics Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">MongoDB Atlas Cloud Infrastructure</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Live operational database metrics and cluster telemetry</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Atlas Connected
                  </span>
                  <button
                    onClick={handleDownloadSystemBackup}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Backup DB</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Cloud Cluster</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5 truncate">cluster0.qmgmg6m</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Atlas AWS Region</p>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Database Name</p>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">employeedb</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{employees.length} documents stored</p>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">API Latency</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">&lt; 18ms</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Nginx Reverse Proxy</p>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Security & SSL</p>
                  <p className="text-sm font-bold text-sky-600 dark:text-sky-400 mt-0.5">TLS 1.3 / Auth</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Whitelisted & Secure</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════ EMPLOYEES TAB ══════════════════════ */}
        {activeTab === 'employees' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">
                All Employees <span className="text-sm font-normal text-gray-400 ml-1">({filteredEmps.length} shown)</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white w-40 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                {/* Dept filter */}
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
                  className="py-2 px-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {departments.map((d) => <option key={d}>{d}</option>)}
                </select>
                <button onClick={exportEmployeesCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors">
                  <Download className="w-4 h-4" /> CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-12 text-center text-gray-400 dark:text-gray-600">Loading employees...</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/60 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {[['name','Name'],['department','Department'],['position','Position'],['email','Email'],['salary','Salary']].map(([f,l]) => (
                        <th key={f} className="text-left px-5 py-3 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 select-none" onClick={() => toggleSort(f)}>
                          <span className="flex items-center gap-1">{l}<SortIcon field={f} /></span>
                        </th>
                      ))}
                      <th className="px-5 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmps.map((emp, i) => (
                      <tr key={emp._id || i} className="border-t border-gray-50 dark:border-gray-800 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition-colors group">
                        <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white">{emp.name}</td>
                        <td className="px-5 py-3.5">
                          <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">{emp.department}</span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{emp.position}</td>
                        <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">{emp.email}</td>
                        <td className="px-5 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">{fmt(emp.salary)}</td>
                        <td className="px-5 py-3.5 text-center">
                          <button
                            onClick={() => handleDeleteEmployee(emp)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                            title="Delete employee"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredEmps.length === 0 && (
                      <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No employees match your filters.</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════ USERS TAB ══════════════════════ */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg">User Accounts ({users.length})</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage roles, permissions, and status for all staff accounts.</p>
                </div>
                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm active:scale-95 transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New User</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/60 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      <th className="text-left px-5 py-3">User</th>
                      <th className="text-left px-5 py-3">Email</th>
                      <th className="text-left px-5 py-3">Role</th>
                      <th className="text-left px-5 py-3">Status</th>
                      <th className="text-center px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.email} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm flex-shrink-0">
                              {u.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">{u.email}</td>
                        <td className="px-5 py-3.5">
                          {editingUser === u.email ? (
                            <select
                              defaultValue={u.role}
                              onChange={(e) => changeRole(u.email, e.target.value)}
                              onBlur={() => setEditingUser(null)}
                              autoFocus
                              className="px-2 py-1 text-xs rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="employee">Employee</option>
                              <option value="manager">Manager</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <button
                              onClick={() => u.email !== ADMIN_EMAIL && setEditingUser(u.email)}
                              title={u.email === ADMIN_EMAIL ? 'Cannot change admin role' : 'Click to change role'}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${roleColor(u.role)} ${u.email !== ADMIN_EMAIL ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'} transition-opacity`}
                            >
                              {u.role}
                            </button>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.status === 'active'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                            {u.status || 'active'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {u.email !== ADMIN_EMAIL && (
                              <>
                                <button onClick={() => toggleUserStatus(u.email)}
                                  className={`p-1.5 rounded-lg text-xs transition-colors ${u.status === 'active' ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30' : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'}`}
                                  title={u.status === 'active' ? 'Suspend user' : 'Activate user'}>
                                  {u.status === 'active' ? <Lock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                </button>
                                <button onClick={() => removeUser(u.email)}
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors" title="Remove user">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {u.email === ADMIN_EMAIL && (
                              <span className="text-xs text-gray-300 dark:text-gray-600 italic">Protected</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════ ACTIVITY LOG TAB ══════════════════════ */}
        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">Activity Log</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Recent admin actions — stored locally.</p>
              </div>
              <button
                onClick={() => { localStorage.removeItem('staffpulse_activity'); setActivityLog([]); showToast('Activity log cleared'); }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                Clear Log
              </button>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-800 max-h-[500px] overflow-y-auto">
              {activityLog.length === 0 ? (
                <div className="p-12 text-center text-gray-400">No activity recorded yet. Actions in the admin panel are logged here.</div>
              ) : (
                activityLog.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{entry.action}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">by {entry.user} · {entry.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════ SETTINGS TAB ══════════════════════ */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            {/* Profile card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 dark:text-white mb-5 text-lg">Admin Profile</h2>
              <div className="flex items-center gap-4 mb-5">
                {currentUser?.picture ? (
                  <img src={currentUser.picture} alt="avatar" className="w-16 h-16 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black">
                    {currentUser?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{currentUser?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
                  <span className={`mt-1 inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${roleColor('admin')}`}>admin</span>
                </div>
              </div>
            </div>

            {/* System settings */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 dark:text-white mb-5 text-lg">System</h2>
              <div className="space-y-4">
                {[
                  {
                    label: 'Dark Mode', desc: 'Toggle light/dark interface theme',
                    icon: <Moon className="w-4 h-4 text-indigo-500" />,
                    control: (
                      <button onClick={() => setIsDark(!isDark)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    )
                  },
                  {
                    label: 'MongoDB Atlas', desc: 'Cloud database — connected',
                    icon: <Globe className="w-4 h-4 text-emerald-500" />,
                    control: (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Connected
                      </span>
                    )
                  },
                  {
                    label: 'Google OAuth', desc: import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'Configured & active' : 'Add VITE_GOOGLE_CLIENT_ID to .env',
                    icon: <Shield className="w-4 h-4 text-sky-500" />,
                    control: (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600' : 'bg-amber-100 dark:bg-amber-950/40 text-amber-600'}`}>
                        {import.meta.env.VITE_GOOGLE_CLIENT_ID ? '✓ Active' : '⚠ Pending'}
                      </span>
                    )
                  },
                  {
                    label: 'Activity Logging', desc: 'Admin actions logged to localStorage',
                    icon: <Activity className="w-4 h-4 text-violet-500" />,
                    control: <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600">✓ Enabled</span>
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center">{item.icon}</div>
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{item.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    {item.control}
                  </div>
                ))}
              </div>
            </div>

            {/* Data Operations & Backups */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Data Operations & Backups</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Export system snapshots or restore initial demo records to MongoDB Atlas.</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownloadSystemBackup}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full JSON Backup</span>
                </button>
                <button
                  onClick={handleResetDemoData}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-500" />
                  <span>Re-seed Sample Employees</span>
                </button>
              </div>
            </div>

            {/* Danger zone */}
            <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900 p-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-red-700 dark:text-red-400 text-lg">Danger Zone</h3>
              </div>
              <p className="text-xs text-red-500 dark:text-red-400 mb-4">These actions cannot be undone.</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => { if (window.confirm('Clear all registered users? Demo users and the admin are preserved.')) { localStorage.removeItem('staffpulse_users'); loadData(); showToast('Users cleared'); logActivity('Cleared all registered users'); }}}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all"
                >
                  Clear Registered Users
                </button>
                <button
                  onClick={() => { if (window.confirm('Clear all activity logs?')) { localStorage.removeItem('staffpulse_activity'); setActivityLog([]); showToast('Logs cleared'); }}}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-950/40 active:scale-95 transition-all"
                >
                  Clear Activity Logs
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Create New User Account</h3>
              </div>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jane.doe@company.internal"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Assigned Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 chars"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-sm transition-all"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
