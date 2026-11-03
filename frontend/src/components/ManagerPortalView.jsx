import React, { useState, useEffect } from 'react';
import {
  Users, CheckCircle2, XCircle, Star, Award, TrendingUp, AlertCircle,
  Building2, Plus, Edit3, Trash2, Check, Clock, Coffee, ShieldAlert
} from 'lucide-react';

function RupeeIcon({ className = "w-4 h-4" }) {
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

export default function ManagerPortalView({
  currentUser,
  employees,
  onOpenAddModal,
  onEditEmployee,
  showToast,
}) {
  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' | 'performance' | 'budget' | 'attendance'
  const [deptFilter, setDeptFilter] = useState('All');

  // Leaves state synchronized with Employee portal
  const [leaves, setLeaves] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('staffpulse_leaves'));
      if (stored && Array.isArray(stored)) return stored;
    } catch {}
    return [
      { id: 'LV-101', applicant: 'Alex Rivera', email: 'alex.rivera@company.internal', type: 'Sick Leave', from: '2026-11-10', to: '2026-11-11', days: 2, reason: 'Viral fever & medical rest', status: 'Approved', appliedOn: '01 Nov 2026' },
      { id: 'LV-102', applicant: 'Maya Lin', email: 'maya.lin@company.internal', type: 'Casual Leave', from: '2026-11-24', to: '2026-11-25', days: 2, reason: 'Family wedding event', status: 'Pending', appliedOn: '03 Nov 2026' },
      { id: 'LV-103', applicant: 'David Kim', email: 'david.kim@company.internal', type: 'Earned Leave', from: '2026-12-01', to: '2026-12-05', days: 5, reason: 'Annual vacation', status: 'Pending', appliedOn: '03 Nov 2026' },
    ];
  });

  // Performance ratings state — 0 means not yet rated by manager
  const [ratings, setRatings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('staffpulse_ratings')) || {};
    } catch {
      return {};
    }
  });

  // Hover state for star ratings
  const [hoverRating, setHoverRating] = useState({});

  const saveLeaves = (updated) => {
    setLeaves(updated);
    localStorage.setItem('staffpulse_leaves', JSON.stringify(updated));
  };

  const handleApproveLeave = (id) => {
    const updated = leaves.map((l) => (l.id === id ? { ...l, status: 'Approved' } : l));
    saveLeaves(updated);
    showToast(`Leave application ${id} approved!`, 'success');
  };

  const handleRejectLeave = (id) => {
    const updated = leaves.map((l) => (l.id === id ? { ...l, status: 'Rejected' } : l));
    saveLeaves(updated);
    showToast(`Leave application ${id} marked as rejected.`, 'info');
  };

  const handleSetRating = (empId, starCount) => {
    const updated = { ...ratings, [empId]: starCount };
    setRatings(updated);
    localStorage.setItem('staffpulse_ratings', JSON.stringify(updated));
    showToast(`Performance score set to ${starCount} / 5 Stars!`, 'success');
  };

  const handleHoverRating = (empId, star) => {
    setHoverRating((prev) => ({ ...prev, [empId]: star }));
  };

  const handleHoverLeave = (empId) => {
    setHoverRating((prev) => ({ ...prev, [empId]: 0 }));
  };

  // Calculations
  const filteredEmployees = deptFilter === 'All'
    ? employees
    : employees.filter((e) => e.department === deptFilter);

  const totalDeptPayroll = filteredEmployees.reduce((acc, e) => acc + (e.salary || 0), 0);
  const avgDeptSalary = filteredEmployees.length ? Math.round(totalDeptPayroll / filteredEmployees.length) : 0;
  const pendingLeavesCount = leaves.filter((l) => l.status === 'Pending').length;

  const fmt = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      {/* ── Manager Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-amber-100 border border-white/20">
              <Award className="w-3.5 h-3.5 text-yellow-300" />
              <span>Manager Operations & Governance Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Manager Workspace — {currentUser?.name || 'Department Lead'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl">
              Lead your team with real-time leave approvals, performance evaluations, attendance monitoring, and budget oversight.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center min-w-[120px]">
              <p className="text-[11px] uppercase font-semibold text-amber-200">Pending Leaves</p>
              <p className="text-2xl font-black text-white mt-0.5">{pendingLeavesCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center min-w-[120px]">
              <p className="text-[11px] uppercase font-semibold text-amber-200">Team Headcount</p>
              <p className="text-2xl font-black text-white mt-0.5">{employees.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs Bar ── */}
      <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-x-auto">
        {[
          { key: 'approvals',   label: `Leave Approvals (${pendingLeavesCount} Pending)`, icon: CheckCircle2 },
          { key: 'performance', label: 'Performance Evaluations',                        icon: Star },
          { key: 'budget',      label: 'Department Budget & Headcount',                  icon: RupeeIcon },
          { key: 'attendance',  label: 'Team Daily Attendance',                          icon: Clock },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════ TAB 1: LEAVE APPROVALS ══════════════ */}
      {activeTab === 'approvals' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Leave Requests Queue</h3>
              <p className="text-xs text-slate-400">Review, approve, or reject employee time-off requests</p>
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              {pendingLeavesCount} Requests Awaiting Action
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {leaves.map((l) => (
              <div key={l.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 p-3 rounded-2xl transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{l.id}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{l.applicant}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                      {l.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{l.days} Days:</span> {l.from} to {l.to} • Applied: {l.appliedOn}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{l.reason}"</p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {l.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => handleApproveLeave(l.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectLeave(l.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-800 transition-all active:scale-95"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      l.status === 'Approved'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                    }`}>
                      {l.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════ TAB 2: PERFORMANCE RATINGS ══════════════ */}
      {activeTab === 'performance' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Quarterly Performance Appraisals</h3>
              <p className="text-xs text-slate-400">Rate team competencies and deliver feedback</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Q4 Assessment Cycle
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employees.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-slate-400">
                No employees loaded. Add employees first from the Admin panel or seed demo data.
              </div>
            ) : (
              employees.map((emp) => {
                const empId = emp._id || emp.id;
                const savedScore = ratings[empId] ?? 0; // 0 = not yet rated
                const displayScore = hoverRating[empId] || savedScore;
                const performanceLabel = savedScore === 0
                  ? 'Not Rated'
                  : savedScore >= 5 ? 'Outstanding' : savedScore >= 4 ? 'Exceeding' : savedScore >= 3 ? 'On Track' : savedScore >= 2 ? 'Needs Growth' : 'At Risk';
                const labelColor = savedScore === 0
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  : savedScore >= 4 ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                  : savedScore >= 3 ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300';
                return (
                  <div key={empId} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{emp.name}</h4>
                        <p className="text-xs text-slate-500">{emp.position} • {emp.department}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${labelColor}`}>
                        {performanceLabel}
                      </span>
                    </div>

                    {/* 1-5 Star interactive selector — Manager sets rating, not pre-filled */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-xs font-medium text-slate-500 mr-1">Manager Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleSetRating(empId, star)}
                          onMouseEnter={() => handleHoverRating(empId, star)}
                          onMouseLeave={() => handleHoverLeave(empId)}
                          className="p-0.5 hover:scale-125 transition-transform"
                          title={`Rate ${star} out of 5`}
                        >
                          <Star className={`w-5 h-5 transition-colors ${
                            star <= displayScore
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 dark:text-slate-700 fill-transparent'
                          }`} />
                        </button>
                      ))}
                      <span className="ml-2 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {savedScore === 0 ? 'Click to Rate' : `${savedScore} / 5`}
                      </span>
                    </div>
                    {savedScore > 0 && (
                      <button
                        type="button"
                        onClick={() => { const u = { ...ratings }; delete u[empId]; setRatings(u); localStorage.setItem('staffpulse_ratings', JSON.stringify(u)); showToast('Rating cleared', 'info'); }}
                        className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors underline"
                      >
                        Clear rating
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ══════════════ TAB 3: DEPARTMENT BUDGET (INR ₹) ══════════════ */}
      {activeTab === 'budget' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Department Expenditure & Payroll</h3>
              <p className="text-xs text-slate-400">Financial allocation in Indian Rupees (₹)</p>
            </div>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Staff to Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Total Department Payroll</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{fmt(totalDeptPayroll)}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Annual team compensation</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Team Salary</p>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{fmt(avgDeptSalary)}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Benchmarked annually</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Budget Headroom</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">₹35,00,000</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Available for Q4 hires</p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ TAB 4: TEAM ATTENDANCE ══════════════ */}
      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Live Team Attendance Roster</h3>
              <p className="text-xs text-slate-400">Today's active workplace presence</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              {employees.length} Team Members
            </span>
          </div>

          {employees.length === 0 ? (
            <div className="py-12 text-center text-slate-400">No employees loaded. Add employees to track attendance.</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {employees.map((emp) => {
                const today = new Date().toISOString().slice(0, 10);
                // Check if employee has an approved leave covering today
                const isOnApprovedLeave = leaves.some(
                  (l) =>
                    (l.email === emp.email || l.applicant === emp.name) &&
                    l.status === 'Approved' &&
                    l.from <= today &&
                    l.to >= today
                );
                // Simulate remote/in-office based on employee id hash (consistent per session)
                const empHash = (emp._id || emp.id || '').toString().charCodeAt(0) || 0;
                const isRemote = !isOnApprovedLeave && empHash % 3 === 1;
                const isClockedIn = !isOnApprovedLeave && localStorage.getItem(`staffpulse_clocked_${emp.email}`) === 'true';

                return (
                  <div key={emp._id || emp.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {emp.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{emp.name}</p>
                        <p className="text-xs text-slate-400">{emp.position} • {emp.department}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isOnApprovedLeave
                        ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                        : isClockedIn
                        ? 'bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
                        : isRemote
                        ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                        : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {isOnApprovedLeave ? '🏠 On Approved Leave' : isClockedIn ? '💻 Clocked In (Remote)' : isRemote ? '🏢 In Office' : '🟢 In Office'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

