import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, CheckCircle, Flame } from 'lucide-react';
import { formatPrice } from '../../utils/formatCurrency';
import { toggleFavorite } from '../../services/listingService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ListingCard = ({ listing, onFavoriteToggle }) => {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState(listing.isFavorite || false);
  const [imgSrc, setImgSrc] = useState(
    listing.images?.[0] || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80'
  );

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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
        if (onFavoriteToggle) {
          onFavoriteToggle(listing._id, res.isFavorite);
        }
      }
    } catch {
      showError('Failed to update favorite');
    }
  };

  const isSold = listing.status === 'sold';

  return (
    <div className="listing-card">
      {/* Image Thumbnail Container */}
      <Link to={`/listings/${listing._id}`} className="listing-card-img-wrap">
        <img
          src={imgSrc}
          alt={listing.title}
          onError={() =>
            setImgSrc('https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80')
          }
          className="listing-card-img"
          loading="lazy"
        />

        {/* Featured Ribbon */}
        {listing.isFeatured && !isSold && (
          <div className="listing-card-badge">
            <Flame size={12} fill="white" />
            <span>Featured</span>
          </div>
        )}

        {/* Sold Overlay */}
        {isSold && (
          <div className="listing-sold-overlay">
            <span className="listing-sold-label">SOLD OUT</span>
          </div>
        )}

        {/* Condition Tag */}
        {listing.condition && (
          <span className="listing-condition-tag">{listing.condition}</span>
        )}

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          className={`listing-fav-btn ${isFavorite ? 'active' : 'default'}`}
        >
          <Heart
            size={16}
            fill={isFavorite ? 'white' : 'none'}
            stroke={isFavorite ? 'white' : 'currentColor'}
          />
        </button>
      </Link>

      {/* Card Details */}
      <div className="listing-card-body">
        {/* Category & Verified Seller Row */}
        <div className="listing-card-meta">
          <span className="listing-card-category">
            {listing.category?.name || 'General'}
          </span>
          {listing.seller?.isVerified && (
            <span className="listing-verified">
              <CheckCircle size={12} />
              <span>Verified</span>
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={`/listings/${listing._id}`} className="listing-card-title">
          {listing.title}
        </Link>

        {/* Price & Campus Location */}
        <div className="listing-card-footer">
          <span className="listing-price">
            {formatPrice(listing.price)}
          </span>
          <div className="listing-campus">
            <MapPin size={13} className="listing-campus-icon" />
            <span>{listing.campus?.shortName || 'Campus'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
