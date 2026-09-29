import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Package,
  Clock,
  AlertTriangle,
  Building,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { getAdminStats } from '../../services/adminService';
import { TableSkeleton } from '../../components/common/Skeleton';
import AdminSidebar from '../../components/admin/AdminSidebar';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getAdminStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-sub">
            Real-time platform statistics, moderation workload, and campus distributions.
          </p>
        </div>

        {loading ? (
          <TableSkeleton rows={4} />
        ) : (
          <>
            {/* KPI Cards Grid */}
            <div className="admin-kpi-grid">
              <div className="admin-kpi-card">
                <div className="admin-kpi-top">
                  <span className="admin-kpi-label">Total Users</span>
                  <Users size={18} className="text-primary" />
                </div>
                <div className="admin-kpi-value">{stats?.totalUsers || 0}</div>
                <span className="admin-kpi-sub success">
                  {stats?.verifiedUsers || 0} verified students
                </span>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-top">
                  <span className="admin-kpi-label">Pending Review</span>
                  <Clock size={18} style={{ color: 'var(--warning)' }} />
                </div>
                <div className="admin-kpi-value">{stats?.pendingListings || 0}</div>
                <Link
                  to="/admin/listings?status=pending"
                  className="admin-dist-link"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}
                >
                  <span>Review now</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-top">
                  <span className="admin-kpi-label">Active Listings</span>
                  <Package size={18} style={{ color: 'var(--success)' }} />
                </div>
                <div className="admin-kpi-value">{stats?.activeListings || 0}</div>
                <span className="admin-kpi-sub muted">
                  {stats?.soldListings || 0} sold
                </span>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-top">
                  <span className="admin-kpi-label">Reports Pending</span>
                  <AlertTriangle size={18} style={{ color: 'var(--danger)' }} />
                </div>
                <div className="admin-kpi-value">{stats?.pendingReports || 0}</div>
                <Link
                  to="/admin/reports"
                  style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}
                >
                  <span>Check reports</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Distribution Breakdowns */}
            <div className="admin-dist-grid">
              {/* Campus Distribution */}
              <div className="admin-dist-card">
                <div className="admin-dist-header">
                  <h3 className="admin-dist-title">
                    <Building size={16} className="admin-dist-icon" />
                    <span>Active Listings by Campus</span>
                  </h3>
                  <Link to="/admin/campuses" className="admin-dist-link">
                    Manage Campuses
                  </Link>
                </div>

                <div>
                  {stats?.listingsByCampus && stats.listingsByCampus.length > 0 ? (
                    stats.listingsByCampus.map((item, idx) => (
                      <div key={idx} className="admin-dist-row">
                        <span className="admin-dist-name">{item.campusName}</span>
                        <span className="admin-dist-count">
                          {item.count} items
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>No active campus distribution yet</p>
                  )}
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="admin-dist-card">
                <div className="admin-dist-header">
                  <h3 className="admin-dist-title">
                    <Tag size={16} className="admin-dist-icon" />
                    <span>Top Listing Categories</span>
                  </h3>
                  <Link to="/admin/categories" className="admin-dist-link">
                    Manage Categories
                  </Link>
                </div>

                <div>
                  {stats?.listingsByCategory && stats.listingsByCategory.length > 0 ? (
                    stats.listingsByCategory.map((item, idx) => (
                      <div key={idx} className="admin-dist-row">
                        <span className="admin-dist-name">{item.categoryName}</span>
                        <span className="admin-dist-count muted">
                          {item.count} items
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>No categories populated yet</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
