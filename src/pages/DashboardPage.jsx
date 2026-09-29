import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  MessageCircle,
  Clock,
  CheckCircle2,
  Trash2,
  Edit,
  Plus,
  ExternalLink,
  Package,
} from 'lucide-react';
import { getMyListings, deleteListing, markListingSold } from '../services/listingService';
import { formatPrice } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({
    activeCount: 0,
    pendingCount: 0,
    soldCount: 0,
    totalViews: 0,
    totalWhatsappClicks: 0,
  });
  const [loading, setLoading] = useState(true);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    action: null,
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getMyListings();
      if (res.success && res.data) {
        setListings(res.data.listings);
        setStats(res.data.stats);
      }
    } catch {
      showError('Failed to load dashboard listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteClick = (listing) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Listing?',
      message: `Are you sure you want to delete "${listing.title}"? This action cannot be undone.`,
      action: async () => {
        try {
          const res = await deleteListing(listing._id);
          if (res.success) {
            showSuccess('Listing deleted');
            fetchDashboardData();
          }
        } catch {
          showError('Failed to delete listing');
        }
      },
    });
  };

  const handleMarkSoldClick = (listing) => {
    setConfirmModal({
      isOpen: true,
      title: 'Mark as Sold?',
      message: `Mark "${listing.title}" as sold? It will be updated as sold out in the marketplace.`,
      action: async () => {
        try {
          const res = await markListingSold(listing._id);
          if (res.success) {
            showSuccess('Item marked as sold!');
            fetchDashboardData();
          }
        } catch {
          showError('Failed to update listing');
        }
      },
    });
  };

  const executeModalAction = async () => {
    if (confirmModal.action) {
      await confirmModal.action();
    }
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
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
    <div className="dashboard-page">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-welcome">
            Welcome, {user?.firstName} 👋
          </h1>
          <p className="dashboard-welcome-sub">
            Manage your items, check enquiries, and review pending approval status.
          </p>
        </div>
        <Link to="/sell" className="btn btn-primary">
          <Plus size={16} />
          <span>New Listing</span>
        </Link>
      </div>

      {/* KPI Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Active Listings</span>
            <Package size={18} className="stat-icon green" />
          </div>
          <p className="stat-value">{stats.activeCount}</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Pending Review</span>
            <Clock size={18} className="stat-icon amber" />
          </div>
          <p className="stat-value">{stats.pendingCount}</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Sold Items</span>
            <CheckCircle2 size={18} className="stat-icon blue" />
          </div>
          <p className="stat-value">{stats.soldCount}</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Total Views</span>
            <Eye size={18} className="stat-icon sky" />
          </div>
          <p className="stat-value">{stats.totalViews}</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">WhatsApp Clicks</span>
            <MessageCircle size={18} className="stat-icon teal" />
          </div>
          <p className="stat-value">{stats.totalWhatsappClicks}</p>
        </div>
      </div>

      {/* My Listings Section */}
      <div className="dashboard-listings-card">
        <div className="dashboard-listings-header">
          <div>
            <h2 className="dashboard-listings-title">My Listings</h2>
            <p className="dashboard-listings-sub">
              Overview of everything you have posted on CampusMarket
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading your items...
          </div>
        ) : listings.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No listings posted yet"
            description="You haven't listed any items for sale. Start turning your campus essentials into cash!"
            actionLabel="Post Your First Item"
            onAction={() => window.location.assign('/sell')}
          />
        ) : (
          <div>
            {listings.map((l) => (
              <div key={l._id} className="dashboard-listing-row">
                {/* Thumbnail & Title */}
                <div className="dashboard-listing-left">
                  <img
                    src={l.images?.[0] || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=300'}
                    alt={l.title}
                    className="dashboard-listing-img"
                  />
                  <div className="dashboard-listing-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      {getStatusBadge(l.status)}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                        {formatDate(l.createdAt)}
                      </span>
                    </div>
                    <div className="dashboard-listing-title">{l.title}</div>
                    <div className="dashboard-listing-meta">
                      {formatPrice(l.price)} • {l.campus?.shortName}
                    </div>
                  </div>
                </div>

                {/* Metrics & Actions */}
                <div className="dashboard-listing-right">
                  <div className="listing-metrics">
                    <span className="listing-metric" title="Views">
                      <Eye size={14} className="listing-metric-icon" /> {l.views}
                    </span>
                    <span className="listing-metric" title="WhatsApp clicks">
                      <MessageCircle size={14} className="listing-metric-icon whatsapp" /> {l.whatsappClicks}
                    </span>
                  </div>

                  <div className="listing-row-actions">
                    <Link
                      to={`/listings/${l._id}`}
                      className="btn-icon"
                      title="View listing"
                    >
                      <ExternalLink size={16} />
                    </Link>

                    <Link
                      to={`/edit-listing/${l._id}`}
                      className="btn-icon"
                      title="Edit listing"
                    >
                      <Edit size={16} />
                    </Link>

                    {l.status !== 'sold' && (
                      <button
                        type="button"
                        onClick={() => handleMarkSoldClick(l)}
                        className="mark-sold-btn"
                      >
                        Mark Sold
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteClick(l)}
                      className="btn-icon"
                      style={{ color: 'var(--danger)' }}
                      title="Delete listing"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {confirmModal.message}
          </p>
          <div className="confirm-modal-btns">
            <button
              type="button"
              onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={executeModalAction}
              className="btn btn-danger btn-sm"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
