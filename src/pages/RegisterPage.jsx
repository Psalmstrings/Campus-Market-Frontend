import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, Building, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCampuses } from '../services/campusService';
import { useToast } from '../context/ToastContext';
import BrandLogo from '../components/common/BrandLogo';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [campuses, setCampuses] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    campus: '',
    department: '',
    level: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCampusesList = async () => {
      try {
        const res = await getCampuses();
        if (res.success && res.data) {
          setCampuses(res.data);
          if (res.data.length > 0) {
            setFormData((prev) => ({ ...prev, campus: res.data[0]._id }));
          }
        }
      } catch (err) {
        console.error('Failed to load campuses for registration:', err);
      }
    };
    fetchCampusesList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.campus) {
      showError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const res = await register(formData);
      if (res.success) {
        showSuccess('Account created! A confirmation email has been sent to your inbox.');
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Registration failed');
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
        <h2 className="auth-title">Create Your Student Account</h2>
        <p className="auth-subtitle">
          Join verified peers buying and selling across your campus with CampusMart.
        </p>
      </div>

      <div className="auth-card wide">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Name Fields */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <div className="form-input-icon">
                <User size={16} className="icon" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="e.g. Babatunde"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <div className="form-input-icon">
                <User size={16} className="icon" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="e.g. Adeyemi"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div className="form-input-icon">
                <Mail size={16} className="icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. you@gmail.com, you@yahoo.com, or student@unilag.edu.ng"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                All email domains accepted (Gmail, Yahoo, Outlook, University email, etc.)
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp / Phone *</label>
              <div className="form-input-icon">
                <Phone size={16} className="icon" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="08012345678"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Campus Select */}
          <div className="form-group">
            <label className="form-label">Your Campus *</label>
            <div className="form-input-icon">
              <Building size={16} className="icon" />
              <select
                name="campus"
                value={formData.campus}
                onChange={handleChange}
                className="form-select"
                style={{ paddingLeft: '2.5rem' }}
                required
              >
                {campuses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.shortName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Department & Level */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department</label>
              <div className="form-input-icon">
                <GraduationCap size={16} className="icon" />
                <input
                  type="text"
                  name="department"
                  placeholder="e.g. Mass Comm"
                  value={formData.department}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Level</option>
                <option value="100L">100L / ND I</option>
                <option value="200L">200L / ND II</option>
                <option value="300L">300L / HND I</option>
                <option value="400L">400L / HND II</option>
                <option value="500L">500L</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Vendor">Campus Vendor</option>
              </select>
            </div>
          </div>

          {/* Passwords */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password * (Min 6 chars)</label>
              <div className="form-input-icon">
                <Lock size={16} className="icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div className="form-input-icon">
                <Lock size={16} className="icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: '0.75rem' }}
          >
            {submitting ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
