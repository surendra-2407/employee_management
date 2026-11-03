import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Users, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle, Sun, Moon, UserPlus } from 'lucide-react';
import { GoogleIcon } from './LoginPage';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
export default function SignupPage({ onSignup, onSignIn, onBack, isDark, setIsDark }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'employee' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const validate = () => {
    if (!form.name.trim()) return 'Full name is required.';
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters.';
    if (!form.email.includes('@')) return 'Enter a valid email address.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    if (!agreed) return 'You must agree to the terms to continue.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) return setError(err);

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    // Check for duplicate email in stored users
    const stored = JSON.parse(localStorage.getItem('staffpulse_users') || '[]');
    const DEMO_EMAILS = ['admin@staffpulse.io', 'manager@staffpulse.io'];
    if (DEMO_EMAILS.includes(form.email) || stored.find((u) => u.email === form.email)) {
      setError('An account with this email already exists.');
      setIsLoading(false);
      return;
    }

    const newUser = { name: form.name, email: form.email, password: form.password, role: form.role };
    localStorage.setItem('staffpulse_users', JSON.stringify([...stored, newUser]));
    localStorage.setItem('staffpulse_auth', JSON.stringify({ name: form.name, email: form.email, role: form.role }));

    setSuccess('Account created! Redirecting...');
    setTimeout(() => onSignup(newUser), 1000);
    setIsLoading(false);
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const info = await res.json();
      const user = { name: info.name, email: info.email, role: form.role || 'employee', picture: info.picture };
      const stored = JSON.parse(localStorage.getItem('staffpulse_users') || '[]');
      if (!stored.find((u) => u.email === info.email)) {
        stored.push(user);
        localStorage.setItem('staffpulse_users', JSON.stringify(stored));
      }
      localStorage.setItem('staffpulse_auth', JSON.stringify(user));
      onSignup(user);
    } catch {
      setError('Google sign-up failed. Please try again.');
    }
    setGoogleLoading(false);
  };

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
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-100/80 dark:shadow-black/30 p-8">

            {/* Logo */}
            <div className="flex flex-col items-center mb-7">
              <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-900/40 mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Create your account</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Join StaffPulse — it's free</p>
            </div>

            {/* Error / Success */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}



            {/* Form */}
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Smith"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-2.5 pr-11 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    placeholder="Re-enter your password"
                    className="w-full px-4 py-2.5 pr-11 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  I agree to the{' '}
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">Privacy Policy</span>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-indigo-900/30 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" /></svg>Creating account...</>
                ) : (
                  <><UserPlus className="w-4 h-4" /> Create Account</>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400 font-medium">or continue with</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Google Sign Up — moved down */}
            {GOOGLE_CLIENT_ID ? (
              <GoogleSignupButton
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setError('Google sign-up was cancelled or failed.');
                  setGoogleLoading(false);
                }}
                loading={googleLoading}
                setLoading={setGoogleLoading}
              />
            ) : (
              <div className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 text-sm">
                <GoogleIcon />
                <span>Google Sign-Up (add VITE_GOOGLE_CLIENT_ID to enable)</span>
              </div>
            )}

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <button onClick={onSignIn} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleSignupButton({ onSuccess, onError, loading, setLoading }) {
  const login = useGoogleLogin({ onSuccess, onError });
  return (
    <button
      type="button"
      onClick={() => {
        setLoading(true);
        login();
      }}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-60 shadow-sm"
    >
      {loading ? (
        <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
        </svg>
      ) : (
        <GoogleIcon />
      )}
      {loading ? 'Signing in with Google...' : 'Sign up with Google'}
    </button>
  );
}

