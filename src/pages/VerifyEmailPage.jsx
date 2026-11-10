import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight, RefreshCw, Send } from 'lucide-react';
import { verifyEmail, resendVerification } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function VerifyEmailPage() {
  const { token: pathToken } = useParams();
  const [searchParams] = useSearchParams();
  const token = pathToken || searchParams.get('token');
  const initialEmail = searchParams.get('email') || '';

  const { user, updateUser } = useAuth();
  const [email, setEmail] = useState(initialEmail || user?.email || '');
  const [manualToken, setManualToken] = useState(token || '');
  const [status, setStatus] = useState(token ? 'verifying' : 'idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [resending, setResending] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      handleVerify(token);
    }
  }, [token]);

  const handleVerify = async (tokenToUse) => {
    if (!tokenToUse) return;
    setStatus('verifying');
    setErrorMessage('');

    try {
      const res = await verifyEmail(tokenToUse);
      if (res.success) {
        setStatus('success');
        addToast('Email verified successfully! Your account is active.', 'success');
        if (user) {
          updateUser({ ...user, isVerified: true });
        }
      } else {
        setStatus('error');
        setErrorMessage(res.message || 'Verification failed. The token may be expired.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err.response?.data?.message || 'Invalid or expired verification link. Please request a new one.'
      );
    }
  };

  const handleResend = async (e) => {
    e?.preventDefault();
    const targetEmail = email || user?.email;
    if (!targetEmail) {
      addToast('Please provide your email address', 'error');
      return;
    }

    setResending(true);
    try {
      const res = await resendVerification(targetEmail);
      if (res.success) {
        addToast(res.message || 'Verification email sent! Check your inbox.', 'success');
      } else {
        addToast(res.message || 'Could not send verification email.', 'error');
      }
    } catch (err) {
      addToast(
        err.response?.data?.message || 'Failed to resend verification email.',
        'error'
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        {status === 'verifying' && (
          <div className="py-8">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-bold text-slate-900 mb-2">Verifying your email</h1>
            <p className="text-slate-600 text-sm">
              Please wait while we confirm your student credentials...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h1>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Your institutional student status is now officially confirmed. You can now post listings, gain trust badges, and trade safely with peers across your campus.
            </p>
            <button
              onClick={() => navigate('/explore')}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl shadow transition"
            >
              Start Exploring Marketplace
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="py-6">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
              <XCircle className="w-10 h-10" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Verification Failed</h1>
            <p className="text-rose-600 text-sm mb-6 bg-rose-50 p-3 rounded-lg border border-rose-200">
              {errorMessage}
            </p>

            <div className="space-y-4 text-left">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Request New Verification Link
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@unilag.edu.ng"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {resending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Resend Verification Email
              </button>
            </div>
          </div>
        )}

        {status === 'idle' && (
          <div className="py-4 text-center">
            <div className="w-14 h-14 bg-sky-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Check Your Email</h1>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              We sent a confirmation email with a verification link to:
            </p>
            <div className="inline-block bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-800 mb-5">
              {email || user?.email || 'your registered email'}
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Click the verification link in your inbox (or spam folder) to activate your account.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition text-sm disabled:opacity-50"
              >
                {resending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Resend Verification Email
              </button>

              <button
                type="button"
                onClick={() => setShowManualInput((prev) => !prev)}
                className="text-xs text-slate-500 hover:text-slate-800 underline block mx-auto pt-2"
              >
                {showManualInput ? 'Hide manual token form' : 'Have a verification code? Enter it manually'}
              </button>
            </div>

            {showManualInput && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerify(manualToken);
                }}
                className="space-y-3 mt-4 pt-4 border-t border-slate-100 text-left"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Paste Verification Token
                  </label>
                  <input
                    type="text"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder="Paste 64-character token"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition"
                >
                  Verify Token
                </button>
              </form>
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-800">
            &larr; Return to CampusMart Home
          </Link>
        </div>
      </div>
    </div>
  );
}
