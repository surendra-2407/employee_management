import React, { useState, useEffect, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AdminPage from './components/AdminPage';
import EmployeePortalView from './components/EmployeePortalView';
import ManagerPortalView from './components/ManagerPortalView';
import Navbar from './components/Navbar';
import EmployeeStats from './components/EmployeeStats';
import EmployeeTable from './components/EmployeeTable';
import EmployeeModal from './components/EmployeeModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { api } from './services/api';
import { RefreshCw } from 'lucide-react';

// Pages: 'landing' | 'login' | 'signup' | 'app' | 'admin'

export default function App() {
  const [isDark, setIsDark] = useState(() =>
    localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('staffpulse_auth')); } catch { return null; }
  });

  const [page, setPage] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('staffpulse_auth'));
      return u ? 'app' : 'landing';
    } catch { return 'landing'; }
  });

  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const [isSeeding, setIsSeeding] = useState(false);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('table');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => setToast({ message, type });

  // Sync dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const loadStats = useCallback(async () => {
    try { setStats(await api.getStats()); } catch (e) { console.warn(e); }
  }, []);

  const loadEmployees = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const result = await api.getEmployees({ search, department, sortBy, order });
      setEmployees(result.data || []);
      setServerStatus('connected');
    } catch (err) {
      setServerStatus('offline');
      if (!isSilent) showToast(err.message || 'Could not connect to backend', 'error');
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [search, department, sortBy, order]);

  useEffect(() => {
    if (page !== 'app') return;
    const init = async () => {
      const health = await api.checkHealth();
      setServerStatus(health.status === 'healthy' ? 'connected' : 'offline');
      await Promise.all([loadEmployees(), loadStats()]);
    };
    init();
  }, [page]);

  useEffect(() => {
    if (page !== 'app') return;
    const t = setTimeout(() => loadEmployees(true), 250);
    return () => clearTimeout(t);
  }, [search, department, sortBy, order, loadEmployees, page]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([loadEmployees(false), loadStats()]);
    setIsRefreshing(false);
    showToast('Data refreshed successfully', 'info');
  };

  const handleSaveEmployee = async (formData) => {
    if (editingEmployee) {
      await api.updateEmployee(editingEmployee._id || editingEmployee.id, formData);
      showToast(`Updated '${formData.name}' successfully!`, 'success');
    } else {
      await api.createEmployee(formData);
      showToast(`Added '${formData.name}' successfully!`, 'success');
    }
    await Promise.all([loadEmployees(true), loadStats()]);
  };

  const handleConfirmDelete = async (id) => {
    await api.deleteEmployee(id);
    showToast('Employee record deleted', 'info');
    await Promise.all([loadEmployees(true), loadStats()]);
  };

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const res = await api.seedDemoEmployees(true);
      showToast(res.message || 'Sample employees populated!', 'success');
      await Promise.all([loadEmployees(false), loadStats()]);
    } catch (err) {
      showToast(err.message || 'Failed to seed demo data', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setPage('app');
  };

  const handleSignup = (user) => {
    setCurrentUser(user);
    setPage('app');
  };

  const handleLogout = () => {
    localStorage.removeItem('staffpulse_auth');
    setCurrentUser(null);
    setPage('landing');
  };

  // ── Page Router ────────────────────────────
  if (page === 'landing') return (
    <LandingPage
      onGetStarted={() => setPage('signup')}
      onSignIn={() => setPage('login')}
      isDark={isDark}
      setIsDark={setIsDark}
    />
  );

  if (page === 'login') return (
    <LoginPage
      onLogin={handleLogin}
      onBack={() => setPage('landing')}
      onRegister={() => setPage('signup')}
      isDark={isDark}
      setIsDark={setIsDark}
    />
  );

  if (page === 'signup') return (
    <SignupPage
      onSignup={handleSignup}
      onSignIn={() => setPage('login')}
      onBack={() => setPage('landing')}
      isDark={isDark}
      setIsDark={setIsDark}
    />
  );

  if (page === 'admin') return (
    <AdminPage
      currentUser={currentUser}
      onGoToDashboard={() => setPage('app')}
      onLogout={handleLogout}
      isDark={isDark}
      setIsDark={setIsDark}
    />
  );

  // ── Main Dashboard ──────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white font-sans transition-colors duration-200">
      <Navbar
        isDark={isDark}
        setIsDark={setIsDark}
        onOpenAddModal={() => { setEditingEmployee(null); setIsModalOpen(true); }}
        onSeedData={handleSeedData}
        serverStatus={serverStatus}
        isSeeding={isSeeding}
        onLogout={handleLogout}
        currentUser={currentUser}
        onAdminPanel={() => setPage('admin')}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${
                currentUser?.role === 'admin'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                  : currentUser?.role === 'manager'
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
              }`}>
                {currentUser?.role === 'admin' ? '🛡️ Admin Workspace' : currentUser?.role === 'manager' ? '💼 Manager Workspace' : '👤 Employee Portal'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {currentUser?.role === 'admin'
                ? 'Executive Administration & Oversight'
                : currentUser?.role === 'manager'
                ? 'Department Operations & Staff Management'
                : 'Employee Self-Service Workplace'}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Welcome back, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentUser?.name || 'User'}</span> — {currentUser?.role === 'admin' ? 'view overall analytics, govern user RBAC and manage database records.' : currentUser?.role === 'manager' ? 'review team leave requests, track ratings and monitor departmental headcount.' : 'access your live attendance clock-in, submit leave applications, and view company notices.'}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm transition-all"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* ── Role-Specific Dynamic Workspaces (Single Page Architecture) ── */}
        {currentUser?.role === 'employee' && (
          <EmployeePortalView
            currentUser={currentUser}
            employees={employees}
            showToast={showToast}
          />
        )}

        {currentUser?.role === 'manager' && (
          <ManagerPortalView
            currentUser={currentUser}
            employees={employees}
            onOpenAddModal={() => { setEditingEmployee(null); setIsModalOpen(true); }}
            onEditEmployee={(emp) => { setEditingEmployee(emp); setIsModalOpen(true); }}
            showToast={showToast}
          />
        )}

        {currentUser?.role === 'admin' && (
          <div className="space-y-6">
            <EmployeeStats stats={stats} />
            <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                  🛡️
                </div>
                <div>
                  <h4 className="font-bold text-sm text-rose-900 dark:text-rose-200">Executive Admin Control Center Available</h4>
                  <p className="text-xs text-rose-600 dark:text-rose-400">Access full RBAC user management, MongoDB Atlas live telemetry & database backups.</p>
                </div>
              </div>
              <button
                onClick={() => setPage('admin')}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 whitespace-nowrap"
              >
                Open Admin Suite
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Team Directory</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              {employees.length} {employees.length === 1 ? 'member' : 'members'}
            </span>
          </div>

          <EmployeeTable
            employees={employees}
            isLoading={isLoading}
            search={search}
            setSearch={setSearch}
            department={department}
            setDepartment={setDepartment}
            sortBy={sortBy}
            setSortBy={setSortBy}
            order={order}
            setOrder={setOrder}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onEdit={(emp) => { setEditingEmployee(emp); setIsModalOpen(true); }}
            onDelete={(emp) => setDeletingEmployee(emp)}
            onOpenAddModal={() => { setEditingEmployee(null); setIsModalOpen(true); }}
            onSeedData={handleSeedData}
            currentUser={currentUser}
            showToast={showToast}
          />
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <p>StaffPulse &bull; Employee Management System</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              MongoDB Atlas Connected
            </span>
          </div>
        </div>
      </footer>

      <EmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSaveEmployee} employee={editingEmployee} />
      <DeleteConfirmModal isOpen={Boolean(deletingEmployee)} onClose={() => setDeletingEmployee(null)} onConfirm={handleConfirmDelete} employee={deletingEmployee} />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
}
