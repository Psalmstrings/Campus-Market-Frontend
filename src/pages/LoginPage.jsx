import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BrandLogo from '../components/common/BrandLogo';

export const LoginPage = () => {
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please enter both email and password');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login({ email, password });
      if (res.success) {
        showSuccess('Logged in successfully!');
        if (res.data.user.role === 'admin' && from === '/') {
          navigate('/admin');
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-logo-wrap">
        <Link to="/" style={{ display: 'inline-flex', marginBottom: '1rem', textDecoration: 'none' }}>
          <BrandLogo size="lg" />
        </Link>
        <h2 className="auth-title">Welcome back to CampusMart</h2>
        <p className="auth-subtitle">
          Buy, sell, and discover student deals across Nigerian campuses
        </p>
      </div>

      <div className="auth-card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Email Address</label>
            <div className="form-input-icon">
              <Mail size={16} className="icon" />
              <input
                type="email"
                placeholder="e.g. you@gmail.com, you@yahoo.com, or student@unilag.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8125rem', color: '#0284c7', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>
            <div className="form-input-icon" style={{ marginTop: '0.375rem' }}>
              <Lock size={16} className="icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: '0.5rem' }}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account yet?{' '}
          <Link to="/register" className="auth-link">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
