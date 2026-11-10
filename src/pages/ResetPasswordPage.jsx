import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Loader2, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';
import { resetPassword } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ResetPasswordPage() {
  const { token: pathToken } = useParams();
  const [searchParams] = useSearchParams();
  const token = pathToken || searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { addToast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      addToast('Reset token is missing from the link. Please request a new password reset.', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(token, { password, confirmPassword });
      if (res.success) {
        setSuccess(true);
        addToast('Password reset successfully! You are now logged in.', 'success');
        if (res.data?.token && res.data?.user) {
          localStorage.setItem('campusmarket_token', res.data.token);
          localStorage.setItem('campusmarket_user', JSON.stringify(res.data.user));
        }
      }
    } catch (err) {
      addToast(
        err.response?.data?.message || 'Invalid or expired password reset link. Please request a new one.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Reset Token Required</h1>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Please use the password reset link that was sent to your email address, or request a new one below.
          </p>
          <Link
            to="/forgot-password"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm transition"
          >
            Request Password Reset Link
          </Link>
          <div className="mt-4">
            <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        {success ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Password Updated!</h1>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Your password has been changed successfully. You can now use your new password to sign in to CampusMart.
            </p>
            <button
              onClick={() => navigate('/explore')}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm transition"
            >
              Continue to Marketplace <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            <div className="w-12 h-12 bg-sky-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Choose New Password</h1>
            <p className="text-slate-600 text-sm mb-6">
              Enter a new secure password for your CampusMart account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm transition inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Update Password
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800">
                Cancel and return to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
