import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { getReports, updateReportStatus } from '../../services/reportService';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { TableSkeleton } from '../../components/common/Skeleton';
import { Link } from 'react-router-dom';

export const AdminReportsPage = () => {
  const { showSuccess, showError } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchReportsList = async () => {
    try {
      setLoading(true);
      const res = await getReports(statusFilter !== 'all' ? statusFilter : '');
      if (res.success && res.data) {
        setReports(res.data);
      }
    } catch {
      showError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsList();
  }, [statusFilter]);

  const handleAction = async (id, status, action = null) => {
    try {
      const res = await updateReportStatus(id, { status, action });
      if (res.success) {
        showSuccess(res.message);
        fetchReportsList();
      }
    } catch {
      showError('Failed to update report');
    }
  };

  const getReportBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning">pending</span>;
      case 'resolved':
        return <span className="badge badge-success">resolved</span>;
      default:
        return <span className="badge badge-muted">{status}</span>;
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 className="admin-page-title">Reports & Safety Flags</h1>
            <p className="admin-page-sub">
              Review flagged suspicious listings, fraudulent attempts, and policy violations.
            </p>
          </div>

          <div className="admin-filter-bar" style={{ margin: 0 }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
        </div>

        {/* Reports Table */}
        <div className="admin-table-card">
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <TableSkeleton rows={4} />
            </div>
          ) : reports.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>
              No reports found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Reported Listing</th>
                    <th>Reported By</th>
                    <th>Reason & Details</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Moderation Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r._id}>
                      <td>
                        {r.listing ? (
                          <div>
                            <Link
                              to={`/listings/${r.listing._id}`}
                              target="_blank"
                              style={{ fontWeight: '700', color: 'var(--text-dark)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                              <span>{r.listing.title}</span>
                              <Eye size={12} className="text-primary" />
                            </Link>
                            <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--text-light)' }}>
                              Seller: {r.listing.seller?.firstName} {r.listing.seller?.lastName} ({r.listing.campus?.shortName})
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Listing deleted</span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>
                          {r.reportedBy?.firstName} {r.reportedBy?.lastName}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-light)' }}>{r.reportedBy?.email}</div>
                      </td>
                      <td style={{ maxWidth: '280px' }}>
                        <span className="badge badge-danger" style={{ marginBottom: '0.25rem' }}>
                          {r.reason}
                        </span>
                        {r.description && (
                          <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }} className="line-clamp-2">
                            {r.description}
                          </p>
                        )}
                      </td>
                      <td style={{ color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
                        {formatDate(r.createdAt)}
                      </td>
                      <td>
                        {getReportBadge(r.status)}
                      </td>
                      <td>
                        <div className="admin-action-row">
                          {r.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleAction(r._id, 'resolved', 'remove_listing')}
                                className="admin-text-btn reject"
                                title="Remove listing and resolve report"
                              >
                                Remove Listing
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAction(r._id, 'dismissed')}
                                className="admin-text-btn"
                                style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
                                title="Dismiss report as invalid"
                              >
                                Dismiss
                              </button>
                            </>
                          )}
                        </div>
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

export default AdminReportsPage;
