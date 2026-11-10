import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, MapPin, Calendar, ArrowLeft, Package } from 'lucide-react';
import api from '../services/api';
import ListingCard from '../components/listing/ListingCard';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/formatDate';

export const SellerProfilePage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/users/${id}/seller-profile`);
        if (res.data?.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load seller profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeller();
  }, [id]);

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    );
  }

  if (!data?.seller) {
    return (
      <div style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Seller not found</p>
      </div>
    );
  }

  const { seller, activeListings, totalActive } = data;

  return (
    <div className="standard-page">
      <Link
        to="/explore"
        className="detail-back-btn"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Marketplace</span>
      </Link>

      {/* Seller Header Banner */}
      <div className="seller-profile-header">
        {seller.profileImage ? (
          <img
            src={seller.profileImage}
            alt={seller.firstName}
            className="seller-avatar-lg"
          />
        ) : (
          <div className="seller-avatar-lg">
            {seller.firstName?.[0]}
            {seller.lastName?.[0]}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
            <h1 className="seller-name">
              {seller.firstName} {seller.lastName}
            </h1>
            {seller.isVerified && (
              <span className="badge badge-success">
                <CheckCircle2 size={12} />
                <span>Verified Student</span>
              </span>
            )}
          </div>

          <p className="seller-meta">
            {seller.department || 'Student'} • {seller.level || 'Undergraduate'}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={13} className="text-primary" />
              <span>{seller.campus?.name} ({seller.campus?.shortName})</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={13} className="text-primary" />
              <span>Member since {formatDate(seller.createdAt)}</span>
            </span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-light)', padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1.5px solid var(--border)' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-dark)', display: 'block' }}>
            {totalActive}
          </span>
          <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Active Listings
          </span>
        </div>
      </div>

      {/* Seller's Listings Grid */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '1.25rem' }}>
          Active Listings by {seller.firstName}
        </h2>

        {activeListings.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No active listings"
            description="This seller currently has no items published in the marketplace."
          />
        ) : (
          <div className="listings-grid listings-grid-4">
            {activeListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfilePage;
