import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

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

  const handleFillDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@campusmarket.ng');
      setPassword('AdminPassword123!');
    } else if (type === 'student') {
      setEmail('tunde@unilag.edu.ng');
      setPassword('Password123!');
    } else if (type === 'yabatech') {
      setEmail('chioma@yabatech.edu.ng');
      setPassword('Password123!');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-logo-wrap">
        <Link to="/" className="auth-logo-icon">
          <ShoppingBag size={28} />
        </Link>
        <h2 className="auth-title">Welcome back to CampusMarket</h2>
        <p className="auth-subtitle">
          Buy, sell, and discover student deals across Nigerian campuses
        </p>
      </div>

      <div className="auth-card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Student / Vendor Email</label>
            <div className="form-input-icon">
              <Mail size={16} className="icon" />
              <input
                type="email"
                placeholder="e.g. tunde@unilag.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Password</label>
            <div className="form-input-icon">
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

        {/* Quick Demo Logins for fast testing */}
        <div className="demo-section">
          <div className="demo-section-label">Quick Test Accounts</div>
          <div className="demo-btns">
            <button
              type="button"
              onClick={() => handleFillDemo('student')}
              className="demo-btn"
            >
              UNILAG Student
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('yabatech')}
              className="demo-btn"
            >
              YABATECH Student
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="demo-btn"
            >
              Admin User
            </button>
          </div>
        </div>

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
