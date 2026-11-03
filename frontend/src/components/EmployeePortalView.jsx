import React, { useState, useEffect } from 'react';
import {
  Clock, Calendar, CheckCircle, XCircle, AlertCircle, Plus, Send,
  FileText, Briefcase, Award, Coffee, Bell, ChevronRight, X, Sparkles
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

const DEFAULT_HOLIDAYS = [
  { name: 'Republic Day', date: '26 Jan 2026', type: 'National Holiday' },
  { name: 'Holi Festival', date: '14 Mar 2026', type: 'Gazetted Holiday' },
  { name: 'Independence Day', date: '15 Aug 2026', type: 'National Holiday' },
  { name: 'Gandhi Jayanti', date: '02 Oct 2026', type: 'National Holiday' },
  { name: 'Diwali (Deepavali)', date: '08 Nov 2026', type: 'Gazetted Holiday' },
  { name: 'Christmas Day', date: '25 Dec 2026', type: 'Public Holiday' },
];

const DEFAULT_ANNOUNCEMENTS = [
  { id: 1, title: 'Annual Performance Appraisal Cycle 2026', date: 'Yesterday', tag: 'HR Update', content: 'Self-evaluations are now open. Complete your goals review before the end of the month.' },
  { id: 2, title: 'Corporate Health & Wellness Program', date: '3 days ago', tag: 'Benefits', content: 'Free annual health check-ups and gym wellness subsidies are now available for all full-time staff.' },
  { id: 3, title: 'New Cloud Architecture Standards Published', date: '1 week ago', tag: 'Engineering', content: 'Updated guidelines for microservice containerization and MongoDB Atlas best practices.' },
];

export default function EmployeePortalView({ currentUser, employees, showToast }) {
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'leaves' | 'payslip' | 'notices'
  const [isClockedIn, setIsClockedIn] = useState(() => localStorage.getItem(`staffpulse_clocked_${currentUser?.email}`) === 'true');
  const [clockInTime, setClockInTime] = useState(() => localStorage.getItem(`staffpulse_clockin_time_${currentUser?.email}`) || '09:15 AM');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Leaves state
  const [leaves, setLeaves] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('staffpulse_leaves'));
      if (stored && Array.isArray(stored)) return stored;
    } catch {}
    return [
      { id: 'LV-101', applicant: currentUser?.name || 'Employee', email: currentUser?.email || '', type: 'Sick Leave', from: '2026-11-10', to: '2026-11-11', days: 2, reason: 'Viral fever & medical rest', status: 'Approved', appliedOn: '01 Nov 2026' },
      { id: 'LV-102', applicant: currentUser?.name || 'Employee', email: currentUser?.email || '', type: 'Casual Leave', from: '2026-11-24', to: '2026-11-25', days: 2, reason: 'Family celebration', status: 'Pending', appliedOn: '03 Nov 2026' },
    ];
  });

  const [leaveForm, setLeaveForm] = useState({
    type: 'Casual Leave',
    from: '',
    to: '',
    reason: '',
  });

  // Sync leaves to localStorage so Manager can approve/reject them
  useEffect(() => {
    localStorage.setItem('staffpulse_leaves', JSON.stringify(leaves));
  }, [leaves]);

  const handleToggleClock = () => {
    if (!isClockedIn) {
      const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      setIsClockedIn(true);
      setClockInTime(timeStr);
      localStorage.setItem(`staffpulse_clocked_${currentUser?.email}`, 'true');
      localStorage.setItem(`staffpulse_clockin_time_${currentUser?.email}`, timeStr);
      showToast(`Clocked In successfully at ${timeStr}! Have a productive day.`, 'success');
    } else {
      setIsClockedIn(false);
      localStorage.setItem(`staffpulse_clocked_${currentUser?.email}`, 'false');
      showToast('Clocked Out for the day. Rest well!', 'info');
    }
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!leaveForm.from || !leaveForm.to || !leaveForm.reason.trim()) {
      return showToast('Please fill out all leave details.', 'error');
    }

    const newLeave = {
      id: `LV-${Math.floor(100 + Math.random() * 900)}`,
      applicant: currentUser?.name || 'Employee User',
      email: currentUser?.email || '',
      type: leaveForm.type,
      from: leaveForm.from,
      to: leaveForm.to,
      days: Math.max(1, Math.ceil((new Date(leaveForm.to) - new Date(leaveForm.from)) / (1000 * 60 * 60 * 24)) + 1),
      reason: leaveForm.reason.trim(),
      status: 'Pending',
      appliedOn: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    const updated = [newLeave, ...leaves];
    setLeaves(updated);
    setIsLeaveModalOpen(false);
    setLeaveForm({ type: 'Casual Leave', from: '', to: '', reason: '' });
    showToast(`Leave application (${newLeave.type}) submitted for manager approval!`, 'success');
  };

  // Matched employee salary calculation in INR
  const matchedEmp = employees.find((e) => e.email?.toLowerCase() === currentUser?.email?.toLowerCase());
  const annualSalary = matchedEmp?.salary || 950000;
  const monthlySalary = Math.round(annualSalary / 12);
  const basicPay = Math.round(monthlySalary * 0.5);
  const hra = Math.round(monthlySalary * 0.3);
  const specialAllowance = Math.round(monthlySalary * 0.2);
  const pfDeduction = Math.round(basicPay * 0.12);
  const netTakeHome = monthlySalary - pfDeduction;

  const fmt = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      {/* ── Employee Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-indigo-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Employee Self-Service Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {currentUser?.name || 'Team Member'}!
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 max-w-xl">
              Track your daily work hours, apply for leaves, access salary slips, and stay up-to-date with company news.
            </p>
          </div>

          {/* Quick Clock-In Widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 flex items-center gap-4 self-start md:self-auto min-w-[260px]">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner ${
              isClockedIn ? 'bg-emerald-500 text-white animate-pulse' : 'bg-white/20 text-indigo-100'
            }`}>
              <Clock className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-indigo-200 uppercase font-semibold tracking-wider">Today's Shift</p>
              <p className="text-sm font-bold text-white">
                {isClockedIn ? `Clocked In (${clockInTime})` : 'Not Clocked In'}
              </p>
              <button
                onClick={handleToggleClock}
                className={`mt-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
                  isClockedIn
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-slate-900'
                }`}
              >
                {isClockedIn ? 'Clock Out Now' : 'Clock In for Today'}
              </button>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* ── Sub Navigation Tabs ── */}
      <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-x-auto">
        {[
          { key: 'attendance', label: 'My Attendance & Clock-In', icon: Clock },
          { key: 'leaves',     label: 'Leave & Time-Off',       icon: Calendar },
          { key: 'payslip',    label: 'My Salary & Pay Slip',   icon: RupeeIcon },
          { key: 'notices',    label: 'Company Bulletin',       icon: Bell },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════ TAB 1: ATTENDANCE & SHIFT ══════════════ */}
      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Card */}
          <div className="md:col-span-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Shift Telemetry</span>
            </h3>
            <div className="text-center py-4">
              <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-black mb-3 ${
                isClockedIn
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-4 border-emerald-400/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                {isClockedIn ? '✓' : '—'}
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {isClockedIn ? 'Active Work Session' : 'Shift Not Started'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Standard shift: 09:30 AM – 06:30 PM IST
              </p>
            </div>
            <button
              onClick={handleToggleClock}
              className={`w-full py-3 rounded-2xl text-sm font-bold transition-all shadow-md active:scale-95 ${
                isClockedIn
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isClockedIn ? 'End Shift (Clock Out)' : 'Start Shift (Clock In)'}
            </button>
          </div>

          {/* Weekly attendance breakdown */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Weekly Attendance Log</h3>
                <p className="text-xs text-slate-400 mt-0.5">Current work week (Monday – Friday)</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                100% Attendance
              </span>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {[
                { day: 'Mon', date: '02 Nov', status: 'Present', in: '09:12 AM', out: '06:35 PM' },
                { day: 'Tue', date: '03 Nov', status: isClockedIn ? 'Present' : 'Active', in: clockInTime, out: 'In Progress' },
                { day: 'Wed', date: '04 Nov', status: 'Scheduled', in: '—', out: '—' },
                { day: 'Thu', date: '05 Nov', status: 'Scheduled', in: '—', out: '—' },
                { day: 'Fri', date: '06 Nov', status: 'Scheduled', in: '—', out: '—' },
              ].map((d) => (
                <div key={d.day} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{d.day}</p>
                  <p className="text-[10px] text-slate-400">{d.date}</p>
                  <span className={`my-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    d.status === 'Present' || d.status === 'Active'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {d.status}
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono">In: {d.in}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Out: {d.out}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ TAB 2: LEAVE & TIME-OFF ══════════════ */}
      {activeTab === 'leaves' && (
        <div className="space-y-6">
          {/* Leave Balances */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { type: 'Casual Leave (CL)', remaining: 6, total: 8, col: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
              { type: 'Sick Leave (SL)',   remaining: 8, total: 10, col: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
              { type: 'Earned Leave (EL)', remaining: 14, total: 18, col: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
            ].map((l) => (
              <div key={l.type} className={`p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 ${l.bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{l.type}</span>
                  <Coffee className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black ${l.col}`}>{l.remaining}</span>
                  <span className="text-xs text-slate-500">/ {l.total} days remaining</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mt-3 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${(l.remaining / l.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Applications Header */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Leave History & Applications</h3>
                <p className="text-xs text-slate-500">Track approvals from your reporting manager</p>
              </div>
              <button
                onClick={() => setIsLeaveModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md active:scale-95 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Apply for Leave</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                    <th className="py-2.5">Reference</th>
                    <th className="py-2.5">Leave Type</th>
                    <th className="py-2.5">Dates</th>
                    <th className="py-2.5">Duration</th>
                    <th className="py-2.5">Reason</th>
                    <th className="py-2.5 text-right">Approval Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {leaves.map((lv) => (
                    <tr key={lv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-mono text-xs font-bold text-slate-500">{lv.id}</td>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{lv.type}</td>
                      <td className="py-3 text-xs text-slate-500">{lv.from} → {lv.to}</td>
                      <td className="py-3 text-xs font-medium text-slate-700 dark:text-slate-300">{lv.days} Days</td>
                      <td className="py-3 text-xs text-slate-500 max-w-xs truncate">{lv.reason}</td>
                      <td className="py-3 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          lv.status === 'Approved'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : lv.status === 'Rejected'
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        }`}>
                          {lv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ TAB 3: SALARY SLIP (IN RUPEES) ══════════════ */}
      {activeTab === 'payslip' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Monthly Compensation Statement
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                Pay Slip — November 2026
              </h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Annual CTC (Gross)</p>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{fmt(annualSalary)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Earnings (Monthly)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Basic Salary</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{fmt(basicPay)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">House Rent Allowance (HRA)</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{fmt(hra)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Special Allowance</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{fmt(specialAllowance)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold">
                  <span>Gross Monthly Earnings</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{fmt(monthlySalary)}</span>
                </div>
              </div>
            </div>

            {/* Deductions & Net */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Statutory Deductions</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Provident Fund (PF - 12%)</span>
                  <span className="font-mono font-bold text-rose-600">-{fmt(pfDeduction)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Professional Tax (PT)</span>
                  <span className="font-mono font-bold text-rose-600">-₹200</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-extrabold text-base">
                  <span className="text-slate-900 dark:text-white">Net Take-Home Pay</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{fmt(netTakeHome - 200)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ TAB 4: BULLETINS & HOLIDAYS ══════════════ */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Announcements */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-500" />
              <span>Company Announcements</span>
            </h3>
            <div className="space-y-3">
              {DEFAULT_ANNOUNCEMENTS.map((a) => (
                <div key={a.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {a.tag}
                    </span>
                    <span className="text-[11px] text-slate-400">{a.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{a.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{a.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Official Indian Holidays */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>Official Holiday Calendar 2026</span>
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {DEFAULT_HOLIDAYS.map((h) => (
                <div key={h.name} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{h.name}</p>
                    <p className="text-xs text-slate-400">{h.type}</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                    {h.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Apply Leave Modal ── */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Apply for Leave</h3>
              <button onClick={() => setIsLeaveModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Leave Category</label>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                >
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Privilege / Earned Leave</option>
                  <option>Maternity / Paternity Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.from}
                    onChange={(e) => setLeaveForm({ ...leaveForm, from: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.to}
                    onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Reason for Leave</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide details for your reporting manager..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

