import React, { useState, useEffect } from 'react';
import {
  Users, BarChart3, Search, Shield, Sun, Moon,
  ArrowRight, CheckCircle, ChevronRight, Building2,
  UserCheck, TrendingUp, Bell, FileText, Clock,
  Star, Award, Briefcase, Zap, Lock, Globe,
  Menu, X
} from 'lucide-react';

function RupeeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12" /><path d="M6 8h12" /><path d="m6 13 8.5 8" /><path d="M6 13h3" />
      <path d="M9 13c6.667 0 6.667-10 0-10" />
    </svg>
  );
}

export default function LandingPage({ onGetStarted, onSignIn, isDark, setIsDark }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const features = [
    { icon: <Clock className="w-6 h-6 text-indigo-600" />, bg: 'bg-indigo-50 dark:bg-indigo-950/40', border: 'border-indigo-100 dark:border-indigo-900', title: 'Attendance & Clock-In', desc: 'Employees clock in and out with live shift timers. Weekly attendance logs tracked automatically per user.' },
    { icon: <FileText className="w-6 h-6 text-emerald-600" />, bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-100 dark:border-emerald-900', title: 'Leave Management', desc: 'Apply for Casual, Sick or Earned Leave. Managers approve or reject instantly with status visible to employees.' },
    { icon: <RupeeIcon className="w-6 h-6 text-amber-600" />, bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-100 dark:border-amber-900', title: 'Salary & Pay Slips (₹)', desc: 'Monthly pay slips with Basic, HRA, Allowances, PF and Professional Tax — all in Indian Rupees (₹).' },
    { icon: <Star className="w-6 h-6 text-violet-600" />, bg: 'bg-violet-50 dark:bg-violet-950/40', border: 'border-violet-100 dark:border-violet-900', title: 'Performance Appraisals', desc: 'Managers rate team members 1–5 stars quarterly. Performance labels update based on manager input.' },
    { icon: <BarChart3 className="w-6 h-6 text-sky-600" />, bg: 'bg-sky-50 dark:bg-sky-950/40', border: 'border-sky-100 dark:border-sky-900', title: 'Payroll Analytics', desc: 'Real-time department payroll breakdown, highest & lowest salaries, total spend — all in ₹ with INR formatting.' },
    { icon: <Shield className="w-6 h-6 text-rose-600" />, bg: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-100 dark:border-rose-900', title: 'Role-Based Access Control', desc: 'Three separate portals — Employee, Manager, Admin — each with distinct features and access levels.' },
  ];

  const roles = [
    {
      icon: <Users className="w-8 h-8" />,
      color: 'from-indigo-500 to-indigo-700',
      glow: 'shadow-indigo-200 dark:shadow-indigo-900/50',
      badge: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300',
      name: '👤 Employee',
      tagline: 'Self-Service Portal',
      points: ['Clock In / Clock Out daily', 'Apply for leaves & track status', 'View monthly pay slip in ₹', 'Company holiday calendar & notices'],
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      color: 'from-amber-500 to-orange-600',
      glow: 'shadow-amber-200 dark:shadow-amber-900/50',
      badge: 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300',
      name: '💼 Manager',
      tagline: 'Department Operations',
      points: ['Approve or reject leave requests', 'Rate team performance (1–5 stars)', 'Monitor daily team attendance', 'Track department payroll in ₹'],
    },
    {
      icon: <Shield className="w-8 h-8" />,
      color: 'from-rose-500 to-rose-700',
      glow: 'shadow-rose-200 dark:shadow-rose-900/50',
      badge: 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300',
      name: '🛡️ Admin',
      tagline: 'Full System Control',
      points: ['Manage all employee records', 'Create & assign user roles (RBAC)', 'Live MongoDB Atlas telemetry', 'Full system backup & activity log'],
    },
  ];

  const stats = [
    { val: '3', label: 'Distinct Role Portals', icon: <Shield className="w-5 h-5 text-indigo-500" /> },
    { val: '₹ INR', label: 'Indian Rupee Support', icon: <RupeeIcon className="w-5 h-5 text-emerald-500" /> },
    { val: '100%', label: 'Real-Time Sync', icon: <Zap className="w-5 h-5 text-amber-500" /> },
    { val: 'Atlas', label: 'MongoDB Cloud DB', icon: <Globe className="w-5 h-5 text-rose-500" /> },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white font-sans transition-colors duration-300 overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-950/95 shadow-md shadow-gray-100/80 dark:shadow-black/40'
          : 'bg-white/80 dark:bg-gray-950/80'
      } border-b border-gray-100 dark:border-gray-800 backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm shadow-indigo-300 dark:shadow-indigo-900">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">StaffPulse</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[['#features', 'Features'], ['#roles', 'Portals'], ['#how-it-works', 'How it works']].map(([href, label]) => (
              <a key={href} href={href} className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{label}</a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Toggle theme">
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={onSignIn} className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sign In</button>
            <button onClick={onGetStarted} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 transition-all shadow-sm shadow-indigo-200 dark:shadow-indigo-900">
              Get Started
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3 space-y-2">
            {[['#features', 'Features'], ['#roles', 'Portals'], ['#how-it-works', 'How it works']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700 dark:text-gray-300 font-medium">{label}</a>
            ))}
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950/30 dark:to-violet-950/20 blur-3xl opacity-60" />
          <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-indigo-100 to-sky-100 dark:from-indigo-950/20 dark:to-sky-950/20 blur-3xl opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-violet-50 dark:bg-violet-950/10 blur-2xl opacity-30" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/60 dark:to-violet-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Enterprise HR Management — Employee · Manager · Admin
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.05]">
            <span className="text-gray-900 dark:text-white">The Smart Way</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
              to Manage People
            </span>
          </h1>

          <p className="mt-7 text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            StaffPulse gives HR teams a single powerful platform — with dedicated portals for employees, managers, and admins — to track attendance, approve leaves, analyze payroll in <strong className="text-gray-700 dark:text-gray-200">Indian Rupees (₹)</strong>, and make confident workforce decisions.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onGetStarted} className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40 active:scale-95 transition-all">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={onSignIn} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all">
              Sign In <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-gray-400 dark:text-gray-500">
            {['No credit card required', 'Free to get started', 'MongoDB Atlas cloud storage', 'Docker containerized'].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" />{t}</span>
            ))}
          </div>
        </div>

        {/* 3D Dashboard Preview */}
        <div className="relative mt-20 max-w-5xl mx-auto perspective-1000">
          <div className="relative transform-gpu" style={{ perspective: '1200px' }}>
            <div
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl shadow-gray-300/60 dark:shadow-black/60 overflow-hidden"
              style={{ transform: 'rotateX(4deg) rotateY(-1deg)', transformOrigin: 'center bottom' }}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <span className="w-3 h-3 rounded-full bg-rose-400 shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm" />
                <div className="flex-1 mx-4 bg-white dark:bg-gray-700 rounded-md px-3 py-1 text-xs text-gray-400 dark:text-gray-500 font-mono text-center">staffpulse.app/dashboard</div>
              </div>

              <div className="p-5 space-y-4 bg-gray-50/50 dark:bg-gray-900">
                {/* Role portal tabs */}
                <div className="flex gap-2">
                  {[
                    { label: '👤 Employee Portal', active: false, color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' },
                    { label: '💼 Manager Hub', active: true, color: 'bg-amber-600 text-white shadow-md' },
                    { label: '🛡️ Admin Control', active: false, color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
                  ].map((tab) => (
                    <span key={tab.label} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${tab.color}`}>{tab.label}</span>
                  ))}
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Team Headcount', val: '48', color: 'text-indigo-600 dark:text-indigo-400' },
                    { label: 'Pending Leaves', val: '3', color: 'text-amber-600 dark:text-amber-400' },
                    { label: 'Dept Payroll', val: '₹42.6 L', color: 'text-emerald-600 dark:text-emerald-400' },
                    { label: 'Avg Salary', val: '₹14.8 L', color: 'text-violet-600 dark:text-violet-400' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                      <p className="text-[11px] text-gray-400 font-medium">{s.label}</p>
                      <p className={`text-xl font-black mt-1 ${s.color}`}>{s.val}</p>
                    </div>
                  ))}
                </div>

                {/* Leave approvals preview */}
                <div className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
                  <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Leave Requests Queue</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">3 Pending</span>
                  </div>
                  {[
                    { name: 'Priya Sharma', type: 'Sick Leave', days: '2 Days', status: 'Pending', statusColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' },
                    { name: 'Alex Rivera', type: 'Casual Leave', days: '3 Days', status: 'Approved', statusColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' },
                    { name: 'Maya Lin', type: 'Earned Leave', days: '5 Days', status: 'Pending', statusColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' },
                  ].map(({ name, type, days, status, statusColor }) => (
                    <div key={name} className="grid grid-cols-4 px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 items-center">
                      <span className="font-semibold text-gray-900 dark:text-white">{name}</span>
                      <span className="text-gray-500">{type}</span>
                      <span className="text-gray-500">{days}</span>
                      <span className={`w-fit px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor}`}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3D floating stat cards */}
            <div className="absolute -left-8 top-16 hidden lg:block" style={{ transform: 'translateZ(30px)' }}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/60 dark:shadow-black/40 border border-gray-100 dark:border-gray-700 p-4 w-44">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center"><Clock className="w-4 h-4 text-indigo-600" /></div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Clocked In</span>
                </div>
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">9:15 AM</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Shift Active — 6h 45m</p>
              </div>
            </div>

            <div className="absolute -right-8 top-24 hidden lg:block" style={{ transform: 'translateZ(30px)' }}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/60 dark:shadow-black/40 border border-gray-100 dark:border-gray-700 p-4 w-48">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-emerald-600" /></div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Leave Approved</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Priya Sharma</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Sick Leave · Nov 10–11</p>
              </div>
            </div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-16 bg-indigo-300/20 dark:bg-indigo-700/15 blur-2xl rounded-full pointer-events-none" />
          </div>
        </div>

        {/* Stats row */}
        <div className="relative mt-16 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">{s.icon}</div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{s.val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 Portals Section ── */}
      <section id="roles" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-4">Three Distinct Portals</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">One platform, three powerful roles</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Each role gets its own dedicated workspace with features built specifically for what they do every day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {roles.map((role, i) => (
              <div
                key={role.name}
                className="group relative bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {/* Header gradient */}
                <div className={`bg-gradient-to-br ${role.color} p-6 text-white`}>
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-inner">
                    {role.icon}
                  </div>
                  <h3 className="text-xl font-black tracking-tight">{role.name}</h3>
                  <p className="text-sm text-white/80 mt-1 font-medium">{role.tagline}</p>
                </div>

                {/* Features list */}
                <div className="p-6 space-y-3">
                  {role.points.map((pt) => (
                    <div key={pt} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{pt}</span>
                    </div>
                  ))}
                  <button
                    onClick={onGetStarted}
                    className={`mt-4 w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r ${role.color} text-white hover:opacity-90 active:scale-95 transition-all shadow-md`}
                  >
                    Get Started →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Everything HR needs</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Built specifically for Indian enterprises with full ₹ INR payroll support.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`group p-6 bg-white dark:bg-gray-900 rounded-2xl border ${f.border} dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg hover:shadow-indigo-100/50 dark:hover:shadow-indigo-950/30 transition-all duration-200`}
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Up and running in minutes</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400 text-base max-w-xl mx-auto">No complex setup. Sign up and start managing your team instantly.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', icon: <UserCheck className="w-7 h-7 text-indigo-600" />, title: 'Create Your Account', desc: 'Sign up as an employee, manager, or admin. Choose your role and get your portal ready in under a minute.' },
              { num: '02', icon: <Users className="w-7 h-7 text-indigo-600" />, title: 'Add Your Team', desc: 'Admin seeds the MongoDB database with your real employee records — names, departments, roles, and salaries in ₹.' },
              { num: '03', icon: <BarChart3 className="w-7 h-7 text-indigo-600" />, title: 'Manage & Analyse', desc: 'Track attendance, approve leaves, evaluate performance, and monitor payroll — all from one unified dashboard.' },
            ].map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center text-center">
                {i < 2 && <div className="hidden md:block absolute top-10 left-1/2 w-full h-px bg-gradient-to-r from-indigo-200 to-transparent dark:from-indigo-800 dark:to-transparent" />}
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-indigo-900 flex items-center justify-center mb-5 shadow-md shadow-indigo-100/50 dark:shadow-indigo-900/30">
                  <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-black">{i + 1}</span>
                  </div>
                  {step.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Docker & Deployment Section ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 sm:p-10 text-white border border-slate-700">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Containerized with Docker</h3>
                <p className="text-slate-400 text-sm">Production-ready deployment with Docker Compose</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'employee-frontend', desc: 'React + Vite served by Nginx', icon: '🌐' },
                { label: 'employee-backend', desc: 'Node.js Express REST API', icon: '⚙️' },
                { label: 'MongoDB Atlas', desc: 'Cloud database — no local install', icon: '🍃' },
              ].map((c) => (
                <div key={c.label} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <p className="text-xl mb-1">{c.icon}</p>
                  <p className="text-sm font-bold text-white">{c.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{c.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-950/60 rounded-xl p-4 font-mono text-sm text-slate-300 border border-slate-700/50">
              <p className="text-slate-500 text-xs mb-2"># Start the entire application stack</p>
              <p><span className="text-emerald-400">$</span> <span className="text-white">docker compose up --build -d</span></p>
              <p className="text-slate-500 text-xs mt-3 mb-1"># App running at:</p>
              <p><span className="text-sky-400">→</span> <span className="text-amber-300">http://localhost:3000</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">Ready to transform your workforce management?</h2>
          <p className="text-indigo-200 mb-10 text-base">Join HR teams across India who rely on StaffPulse every day. Start for free — no setup required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onGetStarted} className="px-8 py-4 rounded-2xl text-base font-bold text-indigo-600 bg-white hover:bg-indigo-50 shadow-xl active:scale-95 transition-all">
              Create Free Account
            </button>
            <button onClick={onSignIn} className="px-8 py-4 rounded-2xl text-base font-semibold text-white border-2 border-white/30 hover:bg-white/10 active:scale-95 transition-all">
              Sign In to Your Portal
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-gray-900 dark:text-white">StaffPulse</span>
            <span className="text-gray-400 text-sm">— Enterprise Employee Management System</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System Active
            </span>
            <span>Built with React · Node.js · MongoDB Atlas · Docker</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
