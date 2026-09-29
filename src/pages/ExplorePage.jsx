import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
} from 'lucide-react';
import { getListings } from '../services/listingService';
import { getCampuses } from '../services/campusService';
import { getCategories } from '../services/categoryService';
import ListingCard from '../components/listing/ListingCard';
import ListingFilters from '../components/listing/ListingFilters';
import { ListingCardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCampus } = useAuth();

  const [listings, setListings] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalListings: 0,
    hasNextPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state initialized from query params or auth selectedCampus
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    campus: searchParams.get('campus') || (selectedCampus !== 'all' ? selectedCampus : 'all'),
    category: searchParams.get('category') || 'all',
    condition: searchParams.get('condition') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page')) || 1,
  });

  // Load campuses and categories once
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cRes, catRes] = await Promise.all([getCampuses(), getCategories()]);
        if (cRes.success) setCampuses(cRes.data);
        if (catRes.success) setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Synchronize URL params with filter changes
  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.campus && filters.campus !== 'all') params.campus = filters.campus;
    if (filters.category && filters.category !== 'all') params.category = filters.category;
    if (filters.condition && filters.condition !== 'all') params.condition = filters.condition;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.sort && filters.sort !== 'newest') params.sort = filters.sort;
    if (filters.page > 1) params.page = filters.page.toString();

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Fetch listings based on current filters
  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getListings({
        search: filters.search,
        campus: filters.campus !== 'all' ? filters.campus : undefined,
        category: filters.category !== 'all' ? filters.category : undefined,
        condition: filters.condition !== 'all' ? filters.condition : undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        sort: filters.sort,
        page: filters.page,
        limit: 12,
      });

      if (res.success && res.data) {
        setListings(res.data.listings);
        setPagination({
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,
          totalListings: res.data.totalListings,
          hasNextPage: res.data.hasNextPage,
        });
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      campus: 'all',
      category: 'all',
      condition: 'all',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      page: 1,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="explore-page">
      {/* Top Header & Search Bar */}
      <div className="explore-header">
        <div>
          <h1 className="explore-title">Explore Marketplace</h1>
          <p className="explore-count">
            {loading ? 'Finding listings...' : `Showing ${pagination.totalListings} listings`}
          </p>
        </div>

        {/* Search & Mobile Filter Toggle */}
        <div className="explore-search-wrap">
          <div className="explore-search-box">
            <Search size={16} className="explore-search-icon" />
            <input
              type="text"
              placeholder="Search in marketplace..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))
              }
              className="explore-search-input"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, search: '', page: 1 }))}
                className="explore-search-clear"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="filter-toggle-btn"
          >
            <SlidersHorizontal size={16} className="text-primary" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid: Sidebar + Results */}
      <div className="explore-grid">
        {/* Desktop Sidebar Filters */}
        <div className="explore-sidebar">
          <ListingFilters
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            campuses={campuses}
            categories={categories}
          />
        </div>

        {/* Listings Display Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {loading ? (
            <div className="listings-grid listings-grid-3">
              {[...Array(6)].map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No listings found"
              description="No items match your active filters or search terms. Try loosening your filters or searching for something else."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <>
              <div className="listings-grid listings-grid-3">
                {listings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>

              {/* Pagination controls */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    type="button"
                    disabled={pagination.currentPage <= 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    className="pagination-btn"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <span className="pagination-text">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={!pagination.hasNextPage}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    className="pagination-btn"
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="mobile-filter-overlay">
          <div
            style={{ position: 'fixed', inset: 0 }}
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="mobile-filter-sheet">
            <div className="mobile-filter-header">
              <h3 className="mobile-filter-title">Filter Listings</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="mobile-filter-close"
              >
                <X size={18} />
              </button>
            </div>

            <ListingFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              campuses={campuses}
              categories={categories}
            />

            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="btn btn-primary btn-full"
              style={{ marginTop: '1rem' }}
            >
              Show {pagination.totalListings} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
