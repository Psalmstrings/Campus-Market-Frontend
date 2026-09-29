import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export const ListingFilters = ({
  filters,
  onChange,
  onReset,
  campuses = [],
  categories = [],
}) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="filters-card">
      <div className="filters-header">
        <div className="filters-title">
          <Filter size={16} className="filters-title-icon" />
          <span>Filters</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="filters-reset"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Campus Filter */}
      <div className="filter-section">
        <label className="filter-label">Campus</label>
        <select
          value={filters.campus || 'all'}
          onChange={(e) => handleChange('campus', e.target.value)}
          className="form-select"
        >
          <option value="all">All Campuses</option>
          {campuses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.shortName} — {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="filter-section">
        <label className="filter-label">Category</label>
        <select
          value={filters.category || 'all'}
          onChange={(e) => handleChange('category', e.target.value)}
          className="form-select"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Condition Filter */}
      <div className="filter-section">
        <label className="filter-label">Condition</label>
        <div className="filter-chips">
          {['all', 'New', 'Like New', 'Good', 'Fair'].map((cond) => {
            const isSelected = (filters.condition || 'all') === cond;
            return (
              <button
                key={cond}
                type="button"
                onClick={() => handleChange('condition', cond)}
                className={`filter-chip ${isSelected ? 'active' : ''}`}
              >
                {cond === 'all' ? 'Any Condition' : cond}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="filter-section">
        <label className="filter-label">Price Range (₦)</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <input
            type="number"
            placeholder="Min (₦)"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="form-input"
          />
          <input
            type="number"
            placeholder="Max (₦)"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {/* Sort Option */}
      <div className="filter-section">
        <label className="filter-label">Sort By</label>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="form-select"
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="views">Most Viewed</option>
        </select>
      </div>
    </div>
  );
};

export default ListingFilters;
