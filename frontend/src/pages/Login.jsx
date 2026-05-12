import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

const DEMO_USERS = [
  { label: 'Admin (Jeff)', email: 'admin@realcrm.com', password: 'admin123',  role: 'Full Access' },
  { label: 'Billy Rabbitt', email: 'billy@demo.com',  password: 'billy2026', role: 'Broker' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Invalid email or password');
    } finally { setLoading(false); }
  };

  const quickLogin = (u) => { setEmail(u.email); setPassword(u.password); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] via-[#1e4976] to-[#2563eb] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur">
            <Home size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">RealCRM</h1>
          <p className="text-blue-200 mt-1 text-sm">Real Estate Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="input pl-10" placeholder="you@realcrm.com" required autoFocus />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="input pl-10 pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Signing in...</> : 'Sign In'}
            </button>
          </form>

          {/* Demo quick-login */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Demo Accounts — Quick Login</p>
            <div className="space-y-2">
              {DEMO_USERS.map(u => (
                <button key={u.email} onClick={() => quickLogin(u)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group">
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700">{u.label}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                  <span className="badge bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 text-[11px]">{u.role}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-3">Click a demo account to pre-fill credentials, then click Sign In</p>
          </div>
        </div>

        <p className="text-center text-blue-200/60 text-xs mt-6">
          RealCRM v1.0 · Custom Real Estate Platform
        </p>
      </div>
    </div>
  );
}
