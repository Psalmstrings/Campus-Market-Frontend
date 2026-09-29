import React from 'react';

export const ListingCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-img" />
    <div className="skeleton-body">
      <div className="skeleton skeleton-line short" />
      <div className="skeleton skeleton-line wide" />
      <div className="skeleton skeleton-line mid" style={{ marginTop: 'auto' }} />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="skeleton skeleton-table-row" />
    ))}
  </div>
);

export default ListingCardSkeleton;
