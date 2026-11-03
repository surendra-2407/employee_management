import React from 'react';
import { Users, Plus, Database, Sun, Moon, LogOut, Shield } from 'lucide-react';

export default function Navbar({
  isDark,
  setIsDark,
  onOpenAddModal,
  onSeedData,
  serverStatus,
  isSeeding,
  onLogout,
  currentUser,
  onAdminPanel,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-white">
                StaffPulse
              </span>
              {currentUser && (
                <span className={`hidden sm:inline ml-2.5 px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${
                  currentUser.role === 'admin'
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                    : currentUser.role === 'manager'
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                    : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                }`}>
                  {currentUser.role === 'admin' ? '🛡️ Admin' : currentUser.role === 'manager' ? '💼 Manager' : '👤 Employee'}
                </span>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* Server Status */}
            <div
              className={`hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                serverStatus === 'connected'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${serverStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${serverStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </span>
              {serverStatus === 'connected' ? 'Live' : 'Connecting...'}
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4" />
              }
            </button>

            {/* Seed Data */}
            <button
              onClick={onSeedData}
              disabled={isSeeding}
              className="hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm disabled:opacity-50"
            >
              <Database className="w-4 h-4 text-indigo-500" />
              {isSeeding ? 'Seeding...' : 'Seed Data'}
            </button>

            {/* Admin Panel — only for admin */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={onAdminPanel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-all shadow-sm"
                title="Open Admin Executive Portal"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Suite</span>
              </button>
            )}

            {/* Add Employee */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>

            {/* Logout */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-all"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
