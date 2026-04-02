import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Mail, Lock, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { email, code: resetCode, newPassword });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-950 px-4">
      <div className="z-10 w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-md shadow-xl">
        {/* Back link */}
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Sign In
        </Link>

        {/* ─── Step 1: Enter Email ─── */}
        {step === 1 && (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-gray-800 border border-gray-700 flex items-center justify-center">
                  <KeyRound size={20} className="text-blue-400" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Forgot Password?</h1>
                  <p className="text-gray-400 text-xs">Enter your email to receive a reset code.</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-800 text-red-400 text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-semibold ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Mail size={17} />
                  </div>
                  <input
                    type="email" required
                    className="w-full bg-gray-950 border border-gray-800 text-white rounded pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-all text-sm"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded transition-colors flex justify-center items-center gap-2 disabled:opacity-50 text-sm">
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</> : 'Send Reset Code'}
              </button>
            </form>
          </>
        )}

        {/* ─── Step 2: Enter Code + New Password ─── */}
        {step === 2 && (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-gray-800 border border-gray-700 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-blue-400" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Reset Password</h1>
                  <p className="text-gray-400 text-xs">Enter the 6-digit code and your new password.</p>
                </div>
              </div>
              <div className="p-3 bg-gray-800 border border-gray-700 rounded text-xs text-gray-400">
                📧 Check your server console for the reset code (local dev).
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-800 text-red-400 text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-semibold ml-1">Reset Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><KeyRound size={17} /></div>
                  <input type="text" required maxLength={6}
                    className="w-full bg-gray-950 border border-gray-800 text-white rounded pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-all text-sm tracking-[0.3em] font-mono text-center"
                    placeholder="000000" value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-semibold ml-1">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><Lock size={17} /></div>
                  <input type="password" required minLength={6}
                    className="w-full bg-gray-950 border border-gray-800 text-white rounded pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-all text-sm"
                    placeholder="Min. 6 characters" value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-semibold ml-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><Lock size={17} /></div>
                  <input type="password" required minLength={6}
                    className="w-full bg-gray-950 border border-gray-800 text-white rounded pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-all text-sm"
                    placeholder="Re-enter password" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded transition-colors flex justify-center items-center gap-2 disabled:opacity-50 text-sm">
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Resetting...</> : 'Reset Password'}
              </button>
              <button type="button" onClick={() => { setStep(1); setError(''); }}
                className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors py-2">
                Didn't receive a code? Try again
              </button>
            </form>
          </>
        )}

        {/* ─── Step 3: Success ─── */}
        {step === 3 && (
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded bg-gray-800 border border-gray-700 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
            </div>
            <h1 className="text-lg font-bold text-white mb-2">Password Reset!</h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your password has been successfully updated. You can now sign in.
            </p>
            <Link to="/login"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-6 rounded transition-colors text-sm">
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
