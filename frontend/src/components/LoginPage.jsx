import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Users, Eye, EyeOff, LogIn, ArrowLeft, AlertCircle, Sun, Moon, User, Briefcase, Shield } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const ADMIN_EMAIL      = import.meta.env.VITE_ADMIN_EMAIL    || 'suripallapothu18@gmail.com';
const ADMIN_PASSWORD   = import.meta.env.VITE_ADMIN_PASSWORD || 'Surendra@2407';
const ADMIN_NAME       = import.meta.env.VITE_ADMIN_NAME     || 'Surendra';

export default function LoginPage({ onLogin, onBack, onRegister, isDark, setIsDark }) {
  const [selectedRole, setSelectedRole]   = useState('employee'); // 'employee' | 'manager' | 'admin'
  const [form, setForm]                   = useState({ email: '', password: '' });
  const [showPassword, setShowPassword]   = useState(false);
  const [error, setError]                 = useState('');
  const [isLoading, setIsLoading]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const ROLE_CONFIGS = {
    employee: {
      key: 'employee',
      name: 'Employee',
      badge: 'User Portal',
      title: 'Employee Workplace Portal',
      subtitle: 'Employee Self-Service — access attendance clock-in, leave requests, team directory & salary slip.',
      role: 'employee',
      icon: User,
      activeClass: 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-500/30',
      badgeClass: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    },
    manager: {
      key: 'manager',
      name: 'Manager',
      badge: 'To Manage',
      title: 'Manager Operations Hub',
      subtitle: 'Department Management — oversee team staffing, approve employee leaves & track performance.',
      role: 'manager',
      icon: Briefcase,
      activeClass: 'bg-amber-600 text-white shadow-md ring-2 ring-amber-500/30',
      badgeClass: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
    admin: {
      key: 'admin',
      name: 'Admin',
      badge: 'Overall Control',
      title: 'Executive Admin Center',
      subtitle: 'Organization Control — full RBAC user management, MongoDB Atlas telemetry, backups & system audit.',
      role: 'admin',
      icon: Shield,
      activeClass: 'bg-rose-600 text-white shadow-md ring-2 ring-rose-500/30',
      badgeClass: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    },
  };

  const handleRoleSwitch = (roleKey) => {
    setSelectedRole(roleKey);
    setError('');
    // Clear both email and password when switching portals
    setForm({
      email: '',
      password: '',
    });
  };

  const getKnownUsers = () => {
    const stored = JSON.parse(localStorage.getItem('staffpulse_users') || '[]');
    return [
      { email: ADMIN_EMAIL,             password: ADMIN_PASSWORD, role: 'admin',    name: ADMIN_NAME || 'Surendra' },
      { email: 'manager@staffpulse.io', password: 'manager123',   role: 'manager',  name: 'Operations Manager' },
      { email: 'employee@staffpulse.io', password: 'employee123', role: 'employee', name: 'Demo Employee User' },
      ...stored,
    ];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const user = getKnownUsers().find(
      (u) => u.email.toLowerCase() === form.email.toLowerCase() && u.password === form.password
    );

    if (user) {
      const session = {
        name: user.name,
        email: user.email,
        role: user.role || selectedRole,
        picture: user.picture || null,
      };
      localStorage.setItem('staffpulse_auth', JSON.stringify(session));
      onLogin(session);
    } else {
      setError('Incorrect email or password. Enter the password for this account.');
    }
    setIsLoading(false);
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const info = await res.json();
      const known = getKnownUsers().find((u) => u.email.toLowerCase() === info.email.toLowerCase());
      const session = {
        name: info.name,
        email: info.email,
        role: known?.role || selectedRole || 'employee',
        picture: info.picture,
      };
      localStorage.setItem('staffpulse_auth', JSON.stringify(session));
      onLogin(session);
    } catch {
      setError('Google sign-in failed. Please try again.');
    }
    setGoogleLoading(false);
  };

  const activeConfig = ROLE_CONFIGS[selectedRole];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans transition-colors duration-300">

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Toggle dark/light theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl p-6 sm:p-9">

            {/* Logo & Portal Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md mb-3 text-white">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">StaffPulse Management</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select your workplace portal to proceed</p>
            </div>

            {/* ── 3-Role Separate Login Portals ── */}
            <div className="grid grid-cols-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-5 gap-1.5">
              {Object.values(ROLE_CONFIGS).map((cfg) => {
                const Icon = cfg.icon;
                const isSelected = selectedRole === cfg.key;
                return (
                  <button
                    key={cfg.key}
                    type="button"
                    onClick={() => handleRoleSwitch(cfg.key)}
                    className={`flex flex-col items-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? cfg.activeClass
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span>{cfg.name}</span>
                    <span className="text-[10px] font-normal opacity-75">{cfg.badge}</span>
                  </button>
                );
              })}
            </div>

            {/* Portal Brief Description */}
            <div className={`mb-5 p-3.5 rounded-2xl border text-xs leading-relaxed transition-all ${activeConfig.badgeClass}`}>
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <activeConfig.icon className="w-3.5 h-3.5" />
                <span>{activeConfig.title}</span>
              </div>
              <p className="opacity-90">{activeConfig.subtitle}</p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ── Email / Password Form (Autofill disabled) ── */}
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  {activeConfig.name} Email Address
                </label>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={`Enter ${activeConfig.name.toLowerCase()} email`}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Password
                  </label>
                  <span className="text-[11px] text-gray-400">Autofill disabled</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter account password"
                    className="w-full px-4 py-2.5 pr-11 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <><Spinner /> Authenticating {activeConfig.name}...</>
                ) : (
                  <><LogIn className="w-4 h-4" /> Sign In to {activeConfig.title}</>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400 font-medium">or continue with</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Google Sign-In — placed down below the form */}
            {GOOGLE_CLIENT_ID ? (
              <GoogleLoginButton
                onSuccess={handleGoogleSuccess}
                onError={() => { setError('Google sign-in failed.'); setGoogleLoading(false); }}
                loading={googleLoading}
                setLoading={setGoogleLoading}
              />
            ) : (
              <div className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 text-sm">
                <GoogleIcon />
                <span>Google Sign-In (add VITE_GOOGLE_CLIENT_ID to enable)</span>
              </div>
            )}

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Need a new account?{' '}
              <button onClick={onRegister} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Register now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared sub-components ──────────────────────────────────────── */

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
    </svg>
  );
}

export function GoogleIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function GoogleLoginButton({ onSuccess, onError, loading, setLoading }) {
  const login = useGoogleLogin({ onSuccess, onError });
  return (
    <button
      type="button"
      onClick={() => { setLoading(true); login(); }}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-60 shadow-sm"
    >
      {loading ? <Spinner /> : <GoogleIcon />}
      {loading ? 'Signing in with Google...' : 'Continue with Google'}
    </button>
  );
}
