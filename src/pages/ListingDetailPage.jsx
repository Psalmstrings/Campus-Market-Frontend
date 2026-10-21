import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Phone,
  MapPin,
  CheckCircle,
  ShieldAlert,
  Eye,
  Calendar,
  ArrowLeft,
  Share2,
  ShieldCheck,
  User,
} from 'lucide-react';
import {
  getListingById,
  recordWhatsappClick,
  recordPhoneClick,
  toggleFavorite,
} from '../services/listingService';
import { formatPrice } from '../utils/formatCurrency';
import { formatDate, formatRelativeTime } from '../utils/formatDate';
import ImageGallery from '../components/listing/ImageGallery';
import ReportModal from '../components/listing/ReportModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [contactingWhatsapp, setContactingWhatsapp] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await getListingById(id);
        if (res.success && res.data) {
          setListing(res.data);
          setIsFavorite(res.data.isFavorite || false);
        }
      } catch {
        showError('Listing not found');
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate, showError]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      showInfo('Please log in to save favorites');
      navigate('/login');
      return;
    }

    try {
      const res = await toggleFavorite(listing._id);
      if (res.success) {
        setIsFavorite(res.isFavorite);
        showSuccess(res.message);
      }
    } catch {
      showError('Failed to update favorite');
    }
  };

  const handleWhatsAppClick = async () => {
    setContactingWhatsapp(true);
    try {
      const res = await recordWhatsappClick(listing._id);
      if (res.success && res.data?.whatsappUrl) {
        window.open(res.data.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      showError('Could not launch WhatsApp');
    } finally {
      setContactingWhatsapp(false);
    }
  };

  const handlePhoneClick = async () => {
    try {
      const res = await recordPhoneClick(listing._id);
      if (res.success && res.data?.phone) {
        window.location.href = `tel:${res.data.phone}`;
      }
    } catch {
      showError('Could not initiate call');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out ${listing.title} on BimsMart for ${formatPrice(listing.price)}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
        <p className="spinner-text">Loading listing details...</p>
      </div>
    );
  }

  if (!listing) return null;

  const isSold = listing.status === 'sold';
  const isOwner = user && listing.seller && user._id === listing.seller._id;

  return (
    <div className="detail-page">
      {/* Back button & Action pills */}
      <div className="detail-back-row">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="detail-back-btn"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="detail-actions">
          <button
            type="button"
            onClick={handleShare}
            className="detail-action-btn"
            title="Share listing"
          >
            <Share2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="detail-action-btn danger"
            title="Report suspicious listing"
          >
            <ShieldAlert size={16} />
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery + Details */}
      <div className="detail-grid">
        {/* Left Column: Image Gallery */}
        <div>
          <ImageGallery images={listing.images} title={listing.title} />
        </div>

        {/* Right Column: Listing Details & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header Card */}
          <div className="detail-info-card">
            {/* Badges */}
            <div className="detail-badges">
              <span className="badge badge-primary">{listing.category?.name}</span>
              <span className="badge badge-muted">Condition: {listing.condition}</span>
              {isSold && <span className="badge badge-danger">SOLD OUT</span>}
            </div>

            {/* Title */}
            <h1 className="detail-title">{listing.title}</h1>

            {/* Price & Location */}
            <div className="detail-price-row">
              <div>
                <span className="detail-price-label">Price</span>
                <div className="detail-price">{formatPrice(listing.price)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="detail-price-label">Campus Location</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '700', fontSize: '0.9375rem' }}>
                  <MapPin size={16} className="text-primary" />
                  <span>{listing.campus?.shortName}</span>
                </div>
              </div>
            </div>

            {/* Exact Location Note */}
            <div className="detail-location-row">
              <MapPin size={16} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
              <span>Campus Spot: <strong style={{ color: 'var(--text-dark)' }}>{listing.location}</strong></span>
            </div>

            {/* Action Buttons */}
            <div className="detail-cta-stack">
              {/* WhatsApp Button */}
              <button
                type="button"
                onClick={handleWhatsAppClick}
                disabled={isSold || contactingWhatsapp}
                className="btn btn-success btn-full"
                style={{ padding: '0.875rem' }}
              >
                <MessageCircle size={18} fill="white" />
                <span>{contactingWhatsapp ? 'Opening WhatsApp...' : 'WhatsApp Seller'}</span>
              </button>

              {/* Call Button */}
              <button
                type="button"
                onClick={handlePhoneClick}
                disabled={isSold}
                className="btn btn-secondary btn-full"
                style={{ padding: '0.875rem' }}
              >
                <Phone size={16} />
                <span>Call Seller</span>
              </button>

              {/* Favorite Button */}
              <button
                type="button"
                onClick={handleFavoriteToggle}
                className={`detail-fav-btn ${isFavorite ? 'active' : ''}`}
              >
                <Heart
                  size={16}
                  fill={isFavorite ? 'var(--danger)' : 'none'}
                  stroke={isFavorite ? 'var(--danger)' : 'currentColor'}
                />
                <span>{isFavorite ? 'Saved in Favorites' : 'Save to Favorites'}</span>
              </button>

              {/* Owner Edit link */}
              {isOwner && (
                <Link
                  to={`/edit-listing/${listing._id}`}
                  style={{ textAlign: 'center', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--primary)', paddingTop: '0.5rem' }}
                >
                  Manage/Edit this listing in Dashboard
                </Link>
              )}
            </div>

            {/* Meta statistics */}
            <div className="detail-meta-row">
              <span className="detail-meta-item">
                <Calendar size={13} />
                <span>Posted {formatRelativeTime(listing.createdAt)}</span>
              </span>
              <span className="detail-meta-item">
                <Eye size={13} />
                <span>{listing.views} views</span>
              </span>
            </div>
          </div>

          {/* Seller Profile Card */}
          {listing.seller && (
            <div className="detail-seller-card">
              <div className="detail-seller-info">
                {listing.seller.profileImage ? (
                  <div className="detail-seller-avatar">
                    <img
                      src={listing.seller.profileImage}
                      alt={listing.seller.firstName}
                    />
                  </div>
                ) : (
                  <div className="detail-seller-avatar">
                    <User size={24} />
                  </div>
                )}
                <div>
                  <div className="detail-seller-name">
                    <span>{listing.seller.firstName} {listing.seller.lastName}</span>
                    {listing.seller.isVerified && (
                      <CheckCircle size={15} style={{ color: 'var(--success)' }} title="Verified Student" />
                    )}
                  </div>
                  <div className="detail-seller-sub">
                    {listing.seller.department || 'Student'} • {listing.seller.level || 'Undergraduate'}
                  </div>
                  <div className="detail-seller-since">
                    Member since {formatDate(listing.seller.createdAt)}
                  </div>
                </div>
              </div>

              <Link
                to={`/sellers/${listing.seller._id}`}
                className="btn btn-secondary btn-sm"
              >
                Profile
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Description Section */}
      <div className="detail-desc-card">
        <h2 className="detail-desc-title">Description</h2>
        <div className="detail-desc-body">{listing.description}</div>
      </div>

      {/* Trust & Safety Warning Card */}
      <div className="detail-safety-card">
        <div className="detail-safety-icon">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 className="detail-safety-title">Safety Reminder for Campus Buyers & Sellers</h3>
          <p className="detail-safety-desc">
            Stay safe: Meet sellers in public locations (such as the campus library or student union), inspect items before payment, and never share your OTP, ATM PIN, or passwords. BimsMart does not charge transaction fees or hold payments.
          </p>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        listingId={listing._id}
        listingTitle={listing.title}
      />
    </div>
  );
};

export default ListingDetailPage;
