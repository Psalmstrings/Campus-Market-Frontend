import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle } from 'lucide-react';
import { getAdminUsers, updateAdminUser } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { TableSkeleton } from '../../components/common/Skeleton';

export const AdminUsersPage = () => {
  const { showSuccess, showError } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers({
        search: search.trim() || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
      });
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch {
      showError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, showError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleVerify = async (user) => {
    try {
      const res = await updateAdminUser(user._id, { isVerified: !user.isVerified });
      if (res.success) {
        showSuccess(user.isVerified ? 'Verification removed' : 'User marked as verified');
        fetchUsers();
      }
    } catch {
      showError('Failed to update verification');
    }
  };

  const handleToggleActive = async (user) => {
    try {
      const res = await updateAdminUser(user._id, { isActive: !user.isActive });
      if (res.success) {
        showSuccess(user.isActive ? 'User account suspended' : 'User reactivated');
        fetchUsers();
      }
    } catch {
      showError('Failed to update user status');
    }
  };

  const handleChangeRole = async (user, newRole) => {
    try {
      const res = await updateAdminUser(user._id, { role: newRole });
      if (res.success) {
        showSuccess(`User role changed to ${newRole}`);
        fetchUsers();
      }
    } catch {
      showError('Failed to change user role');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 className="admin-page-title">User Management</h1>
            <p className="admin-page-sub">
              Verify campus students, manage account permissions, and suspend violators.
            </p>
          </div>

          <div className="admin-filter-bar" style={{ margin: 0 }}>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="vendor">Vendors</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="admin-table-card">
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <TableSkeleton rows={5} />
            </div>
          ) : users.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>
              No users found matching query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student / User</th>
                    <th>Campus & Dept</th>
                    <th>Role</th>
                    <th>Verified</th>
                    <th>Account Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {u.profileImage ? (
                            <img
                              src={u.profileImage}
                              alt={u.firstName}
                              className="user-avatar"
                            />
                          ) : (
                            <div className="user-avatar-initials">
                              {u.firstName?.[0]}
                              {u.lastName?.[0]}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>
                              {u.firstName} {u.lastName}
                            </div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-light)' }}>
                              {u.email} • {u.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{u.campus?.shortName}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-light)' }}>
                          {u.department} {u.level ? `(${u.level})` : ''}
                        </div>
                      </td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u, e.target.value)}
                          className="form-select"
                          style={{ padding: '0.25rem 1.75rem 0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}
                        >
                          <option value="student">student</option>
                          <option value="vendor">vendor</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleVerify(u)}
                          className={`badge ${u.isVerified ? 'badge-success' : 'badge-muted'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                        >
                          <CheckCircle size={12} />
                          <span>{u.isVerified ? 'Verified' : 'Unverified'}</span>
                        </button>
                      </td>
                      <td>
                        <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {u.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(u)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: u.isActive ? 'var(--danger)' : 'var(--success)' }}
                        >
                          {u.isActive ? 'Suspend' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUsersPage;
