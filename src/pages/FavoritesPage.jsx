import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { getMyFavorites } from '../services/listingService';
import ListingCard from '../components/listing/ListingCard';
import { ListingCardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

export const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await getMyFavorites();
      if (res.success && res.data) {
        setFavorites(res.data);
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = (listingId, isFav) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((item) => item._id !== listingId));
    }
  };

  return (
    <div className="standard-page">
      <div>
        <h1 className="page-title">Saved Items</h1>
        <p className="page-sub">Items and services you have saved for later.</p>
      </div>

      {loading ? (
        <div className="listings-grid listings-grid-4">
          {[...Array(4)].map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved listings yet"
          description="Start exploring and save items you like to compare or contact sellers later."
          actionLabel="Explore Marketplace"
          onAction={() => navigate('/explore')}
        />
      ) : (
        <div className="listings-grid listings-grid-4">
          {favorites.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={{ ...listing, isFavorite: true }}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
