import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Flame,
  ExternalLink,
} from 'lucide-react';
import {
  getAdminListings,
  approveListing,
  rejectListing,
  toggleFeatureListing,
} from '../../services/adminService';
import { getCampuses } from '../../services/campusService';
import { formatPrice } from '../../utils/formatCurrency';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { TableSkeleton } from '../../components/common/Skeleton';

export const AdminListingsPage = () => {
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useToast();

  const [listings, setListings] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'all');
  const [filterCampus, setFilterCampus] = useState('all');
  const [search] = useState('');

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAdminListings({
        status: filterStatus !== 'all' ? filterStatus : undefined,
        campus: filterCampus !== 'all' ? filterCampus : undefined,
        search: search.trim() || undefined,
      });
      if (res.success && res.data) {
        setListings(res.data);
      }
    } catch {
      showError('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterCampus, search, showError]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    const loadCampuses = async () => {
      const res = await getCampuses(true);
      if (res.success) setCampuses(res.data);
    };
    loadCampuses();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await approveListing(id);
      if (res.success) {
        showSuccess('Listing approved and published!');
        fetchListings();
      }
    } catch {
      showError('Failed to approve listing');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await rejectListing(id);
      if (res.success) {
        showSuccess('Listing rejected');
        fetchListings();
      }
    } catch {
      showError('Failed to reject listing');
    }
  };

  const handleToggleFeature = async (id) => {
    try {
      const res = await toggleFeatureListing(id);
      if (res.success) {
        showSuccess(res.message);
        fetchListings();
      }
    } catch {
      showError('Failed to update featured status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-success">active</span>;
      case 'pending':
        return <span className="badge badge-warning">pending</span>;
      case 'sold':
        return <span className="badge badge-muted">sold</span>;
      case 'rejected':
      case 'removed':
        return <span className="badge badge-danger">{status}</span>;
      default:
        return <span className="badge badge-muted">{status}</span>;
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="admin-page-title">Listing Moderation</h1>
              <p className="admin-page-sub">
                Review, approve, reject, or feature items posted by students.
              </p>
            </div>

            <div className="admin-filter-bar" style={{ margin: 0 }}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="admin-filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
                <option value="sold">Sold</option>
              </select>

              <select
                value={filterCampus}
                onChange={(e) => setFilterCampus(e.target.value)}
                className="admin-filter-select"
              >
                <option value="all">All Campuses</option>
                {campuses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.shortName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <div className="admin-table-card">
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <TableSkeleton rows={5} />
            </div>
          ) : listings.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>
              No listings found matching these criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Listing</th>
                    <th>Campus & Location</th>
                    <th>Price</th>
                    <th>Seller</th>
                    <th>Status</th>
                    <th>Moderation Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=200'}
                            alt={item.title}
                            className="admin-listing-thumb"
                          />
                          <div>
                            <div className="admin-listing-name">{item.title}</div>
                            <div className="admin-listing-sub">
                              {item.category?.name} • {item.condition}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{item.campus?.shortName}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-light)' }}>{item.location}</div>
                      </td>
                      <td style={{ fontWeight: '800', color: 'var(--text-dark)' }}>
                        {formatPrice(item.price)}
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>
                          {item.seller?.firstName} {item.seller?.lastName}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-light)' }}>{item.seller?.phone}</div>
                      </td>
                      <td>
                        {getStatusBadge(item.status)}
                      </td>
                      <td>
                        <div className="admin-action-row">
                          <Link
                            to={`/listings/${item._id}`}
                            target="_blank"
                            className="admin-action-btn"
                            title="Preview listing"
                          >
                            <ExternalLink size={15} />
                          </Link>

                          {item.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(item._id)}
                                className="admin-text-btn approve"
                                title="Approve"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(item._id)}
                                className="admin-text-btn reject"
                                title="Reject"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {item.status === 'active' && (
                            <button
                              type="button"
                              onClick={() => handleToggleFeature(item._id)}
                              className={`admin-action-btn feature ${item.isFeatured ? 'active' : ''}`}
                              title={item.isFeatured ? 'Unfeature' : 'Feature item'}
                            >
                              <Flame size={15} />
                            </button>
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

export default AdminListingsPage;
