import React, { useState } from 'react';
import { CheckCircle2, Calendar, Building, GraduationCap, Lock, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatDate';
import api from '../services/api';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    department: user?.department || '',
    level: user?.level || '',
    profileImage: user?.profileImage || '',
  });

  const [saving, setSaving] = useState(false);
  const [requestingVerify, setRequestingVerify] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      showError('Please provide both current and new passwords');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showError('New password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      showError('New passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await changePassword(passwordData);
      if (res.success) {
        showSuccess('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile(formData);
      if (res.success && res.data) {
        updateUser(res.data);
        showSuccess('Profile updated successfully!');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyRequest = async () => {
    setRequestingVerify(true);
    try {
      const res = await api.post('/api/users/verify-request');
      if (res.data?.success) {
        updateUser({ ...user, isVerified: true });
        showSuccess('Student verified successfully!');
      }
    } catch {
      showError('Failed to verify student');
    } finally {
      setRequestingVerify(false);
    }
  };

  return (
    <div className="profile-page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">My Profile</h1>
        <p className="page-sub">Manage your account information and campus details.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Left: Summary Card */}
        <div className="card">
          <div className="profile-avatar-section">
            <div style={{ position: 'relative' }}>
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.firstName}
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
              )}
              {user?.isVerified && (
                <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--white)', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
                  <CheckCircle2 size={24} style={{ color: 'var(--success)' }} />
                </div>
              )}
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)' }}>
              {user?.firstName} {user?.lastName}
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {user?.role === 'admin' ? 'Platform Administrator' : `${user?.role?.toUpperCase()} • ${user?.campus?.shortName || 'Campus'}`}
            </p>

            <div style={{ width: '100%', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.625rem', textAlign: 'left', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building size={16} className="text-primary" />
                <span>{user?.campus?.name || 'No campus'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={16} className="text-primary" />
                <span>{user?.department || 'Department not specified'} ({user?.level || 'Level'})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} className="text-primary" />
                <span>Member since {formatDate(user?.createdAt)}</span>
              </div>
            </div>

            {/* Verification status CTA */}
            <div style={{ width: '100%', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
              {user?.isVerified ? (
                <div className="badge badge-success" style={{ width: '100%', justifyContent: 'center', padding: '0.625rem' }}>
                  <CheckCircle2 size={16} />
                  <span>Verified Student</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleVerifyRequest}
                  disabled={requestingVerify}
                  className="btn btn-secondary btn-full btn-sm"
                >
                  {requestingVerify ? 'Verifying...' : 'Request Student Verification'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-dark)', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              Edit Account Information
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email (Read-only)</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="form-input"
                  style={{ background: 'var(--bg-subtle)', color: 'var(--text-light)', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  name="department"
                  placeholder="e.g. Computer Science"
                  value={formData.department}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Academic Level</label>
                <input
                  type="text"
                  name="level"
                  placeholder="e.g. 300L or HND I"
                  value={formData.level}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Profile Image URL</label>
              <input
                type="url"
                name="profileImage"
                placeholder="https://images.unsplash.com/..."
                value={formData.profileImage}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-lg"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card">
          <form onSubmit={handlePasswordSubmit} className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              <KeyRound size={20} className="text-primary" />
              <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-dark)' }}>
                Security & Password Change
              </h3>
            </div>

            <div className="form-group">
              <label className="form-label">Current Password</label>
              <div className="form-input-icon">
                <Lock size={16} className="icon" />
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInput}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">New Password (min 6 characters)</label>
                <div className="form-input-icon">
                  <Lock size={16} className="icon" />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInput}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="form-input-icon">
                  <Lock size={16} className="icon" />
                  <input
                    type="password"
                    name="confirmNewPassword"
                    placeholder="Confirm new password"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordInput}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={changingPassword}
                className="btn btn-secondary btn-lg"
              >
                {changingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
